const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { protect } = require('../middleware/auth');
const Query = require('../models/Query');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

        const location = req.user.location || 'Unknown location';
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

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        const answer = result.response.text() || 'Sorry, I could not generate an answer.';

        const query = await Query.create({ user: req.user._id, question, answer });
        res.json(query);
    } catch (error) {
        console.error('AI Chat Error:', error.message);
        res.status(500).json({ message: 'Failed to get AI response. Check your GEMINI_API_KEY.' });
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
