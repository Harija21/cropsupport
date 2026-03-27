const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Query = require('../models/Query');

// ── Fallback responses when no Gemini key ─────────────────
const fallbackResponses = [
    {
        keywords: ['plant', 'crop', 'grow', 'sow', 'seed', 'month'],
        answer: `**Best Crops to Plant This Season 🌱**

Based on current season (March–April in India):

- **Vegetables:** Okra (Bhindi), Bitter Gourd (Karela), Ridge Gourd, Cucumber
- **Cereals:** Maize (start of Kharif preparation), Sorghum
- **Pulses:** Cowpea, Green Gram (Moong)
- **Cash Crops:** Sunflower, Sesame (Til)

**Key tips:**
- Ensure soil is well-tilled and ploughed 15–20 cm deep
- Apply organic compost (2–3 tonnes/acre) before sowing
- Sow in early morning or evening to reduce transplant shock
- Maintain row spacing of 30–45 cm for most vegetables

*💡 Add your Gemini API key in backend/.env for personalized AI advice!*`
    },
    {
        keywords: ['pest', 'aphid', 'insect', 'disease', 'bug', 'worm', 'fungus', 'blight'],
        answer: `**Pest & Disease Management 🐛**

**Common pests and solutions:**

- **Aphids:** Spray neem oil solution (5ml/litre) or insecticidal soap. Release ladybugs as natural predators.
- **Caterpillars/Armyworm:** Use Bt (Bacillus thuringiensis) spray. Pheromone traps help monitor populations.
- **Whitefly:** Yellow sticky traps. Neem-based pesticide spray every 7 days.
- **Fungal Blight:** Remove infected leaves, apply copper-based fungicide, ensure good air circulation.

**Organic options:**
- Garlic + chili spray as natural repellent
- Diatomaceous earth for crawling insects
- Intercropping with marigold to repel pests

*💡 Upload a crop photo in Disease Detection for AI-powered diagnosis!*`
    },
    {
        keywords: ['water', 'irrigat', 'rain', 'drought', 'moisture'],
        answer: `**Irrigation & Water Management 💧**

**General irrigation guidelines:**

- **Vegetables:** Water every 2–3 days in summer, every 5–7 days in winter
- **Wheat:** 4–6 irrigations — at crown root, tillering, jointing, flowering, milk, and dough stages
- **Rice:** Maintain 2–5 cm standing water during vegetative stage
- **Pulses:** Irrigate at pre-flowering and pod-filling stages

**Water-saving tips:**
- Use drip irrigation to save 40–60% water compared to flood irrigation
- Irrigate in early morning (5–8 AM) or evening to reduce evaporation
- Mulching with dry straw conserves soil moisture
- Check soil moisture 5 cm deep before irrigating

*💡 Check the Weather page for rainfall forecasts and farming advice!*`
    },
    {
        keywords: ['fertiliz', 'manure', 'compost', 'nutrient', 'npk', 'urea'],
        answer: `**Fertilizer & Soil Nutrition Guide 🌿**

**Organic fertilizers (recommended):**
- **Vermicompost:** 2–3 tonnes/acre — improves soil structure and provides all micronutrients
- **FYM (Farm Yard Manure):** 10 tonnes/acre, apply 3 weeks before sowing
- **Green Manure:** Grow dhaincha or sunhemp and incorporate into soil

**Chemical fertilizers (if needed):**
- **NPK 19:19:19** — balanced all-purpose fertilizer
- **Urea (46% N)** — for leafy growth, apply in 2 splits
- **DAP** — excellent phosphorus source, apply at sowing

**Soil testing:**
- Get soil tested every 2–3 years from local Krishi Vigyan Kendra (KVK)
- This helps you apply only what's needed, saving cost and preventing overuse

*💡 Add your Gemini API key for region-specific soil advice!*`
    },
    {
        keywords: ['harvest', 'yield', 'market', 'price', 'sell', 'store', 'storage'],
        answer: `**Harvesting & Post-Harvest Tips 🌾**

**When to harvest:**
- **Vegetables:** Harvest at young/tender stage for better taste and market price
- **Cereals:** When 80–85% of grains turn golden/mature
- **Fruits:** Check skin colour, firmness, and aroma as maturity indicators

**Post-harvest handling:**
- Harvest in early morning to retain freshness
- Sort and grade produce — A/B/C grades fetch different prices
- Use clean, ventilated crates for transport
- Pre-cool leafy vegetables before storage

**Storage tips:**
- Store grains at <12% moisture to prevent fungal growth
- Use cleaned, fumigated gunny bags or metal bins
- Cold storage for vegetables: 0–5°C for leafy greens, 8–12°C for fruits

**Market options:**
- E-NAM (National Agriculture Market) online platform
- Local APMC mandi
- Direct selling to food processors or supermarkets

*💡 Add your Gemini API key for real-time market price insights!*`
    }
];

function getFallbackAnswer(question) {
    const q = question.toLowerCase();
    for (const fb of fallbackResponses) {
        if (fb.keywords.some(k => q.includes(k))) {
            return fb.answer;
        }
    }
    return `**Farm AI Advisor 🌾**

Thank you for your question: *"${question}"*

I can help with topics like:
- 🌱 **Crop planning** — what to plant this season
- 🐛 **Pest & disease management** — organic and chemical solutions
- 💧 **Irrigation** — when and how much to water
- 🌿 **Fertilizers** — organic and NPK recommendations
- 🌾 **Harvesting** — timing and post-harvest handling

**To get personalized AI answers:**
1. Visit [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Create a **free** Gemini API key
3. Add it to \`backend/.env\` as \`GEMINI_API_KEY=your_key\`
4. Restart the backend server

*Your AI advisor will then give region-specific, expert advice for all your farming questions!*`;
}

// Try to load Gemini — gracefully degrade if key is missing
let genAI = null;
let GoogleGenerativeAI;
try {
    ({ GoogleGenerativeAI } = require('@google/generative-ai'));
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.startsWith('AIza')) {
        genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        console.log('✅ Gemini AI loaded successfully');
    } else {
        console.log('ℹ️  No Gemini API key — AI chat will use built-in farming knowledge base');
    }
} catch (e) {
    console.warn('⚠️  Gemini SDK not available, using fallback responses');
}

function getSeason(location = '') {
    const month = new Date().getMonth() + 1;
    const southern = ['australia', 'new zealand', 'south africa', 'brazil', 'argentina', 'chile'];
    const isSouth = southern.some(k => location.toLowerCase().includes(k));
    const m = isSouth ? ((month + 5) % 12) + 1 : month;
    if (m >= 3 && m <= 5) return 'Spring';
    if (m >= 6 && m <= 8) return 'Summer';
    if (m >= 9 && m <= 11) return 'Autumn';
    return 'Winter';
}

// POST /api/ai/chat
router.post('/chat', protect, async (req, res) => {
    try {
        const { question } = req.body;
        if (!question) return res.status(400).json({ message: 'Question is required' });

        let answer;

        if (genAI) {
            // Use real Gemini API
            try {
                const location = req.user.location || 'India';
                const season = getSeason(location);
                const now = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

                const prompt = `You are an expert agricultural advisor for farmers in ${location}.
Season: ${season} | Date: ${now}
Rules:
- Give region-specific advice for ${location}
- Mention local crops, soil types, and farming practices
- Be concise (under 250 words), use bullet points
- Do NOT ask for location — you know it is ${location}

Farmer's question: ${question}`;

                const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
                const result = await model.generateContent(prompt);
                answer = result.response.text() || 'Sorry, I could not generate an answer.';
            } catch (geminiErr) {
                console.error('Gemini error, using fallback:', geminiErr.message);
                answer = getFallbackAnswer(question);
            }
        } else {
            // Use built-in knowledge base
            answer = getFallbackAnswer(question);
        }

        const query = await Query.create({ user: req.user._id, question, answer });
        res.json(query);
    } catch (error) {
        console.error('AI Chat Error:', error.message);
        res.status(500).json({ message: 'Chat service error. Please try again.' });
    }
});

// GET /api/ai/history
router.get('/history', protect, async (req, res) => {
    try {
        const queries = await Query.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(queries);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch history' });
    }
});

module.exports = router;
