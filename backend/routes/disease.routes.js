const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { protect } = require('../middleware/auth');
const DiseaseReport = require('../models/DiseaseReport');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Configure Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '..', 'uploads');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (allowed.includes(file.mimetype)) cb(null, true);
        else cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// POST /api/disease/detect
router.post('/detect', protect, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'Image is required' });

        const imageBytes = fs.readFileSync(req.file.path);
        const base64Image = imageBytes.toString('base64');

        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent([
            {
                inlineData: { data: base64Image, mimeType: req.file.mimetype }
            },
            `Analyze this crop image. Identify any disease or issue.
Format your response EXACTLY as:
Prediction: [disease name or "Healthy"]
Advice: [detailed treatment steps in bullet points]`
        ]);

        const aiText = result.response.text() || '';
        let prediction = 'Unknown';
        let advice = 'Please consult an agricultural expert.';

        if (aiText.includes('Prediction:') && aiText.includes('Advice:')) {
            const parts = aiText.split('Advice:');
            prediction = parts[0].replace('Prediction:', '').trim();
            advice = parts[1].trim();
        } else {
            advice = aiText;
        }

        const imageUrl = `/uploads/${req.file.filename}`;
        const report = await DiseaseReport.create({ user: req.user._id, imageUrl, prediction, advice });

        res.json(report);
    } catch (error) {
        console.error('Disease Detection Error:', error.message);
        res.status(500).json({ message: 'Failed to analyze image. Check your GEMINI_API_KEY.' });
    }
});

// GET /api/disease/history
router.get('/history', protect, async (req, res) => {
    try {
        const reports = await DiseaseReport.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch history' });
    }
});

module.exports = router;
