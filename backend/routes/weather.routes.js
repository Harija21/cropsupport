const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// GET /api/weather
router.get('/', protect, async (req, res) => {
    try {
        const location = req.user.location || 'Your location';
        const temp = Math.floor(Math.random() * 20) + 15; // 15-35°C
        const isRainy = Math.random() > 0.65;
        const condition = isRainy ? 'Rainy' : temp > 28 ? 'Sunny' : 'Cloudy';
        const humidity = Math.floor(Math.random() * 40) + 40; // 40-80%
        const windSpeed = Math.floor(Math.random() * 20) + 5;

        let suggestion;
        if (isRainy) {
            suggestion = 'Rain expected. Avoid pesticide spraying. Ensure proper field drainage to prevent waterlogging.';
        } else if (temp > 30) {
            suggestion = 'High temperatures. Water your crops early morning (5–8 AM) or evening to reduce evaporation.';
        } else {
            suggestion = 'Good farming conditions. Ideal time for field inspection, weeding, and light fertilization.';
        }

        const forecast = [1, 2, 3, 4, 5].map(day => ({
            day: new Date(Date.now() + day * 86400000).toLocaleDateString('en-IN', { weekday: 'short' }),
            temp: Math.floor(Math.random() * 15) + 18,
            condition: Math.random() > 0.6 ? 'Rainy' : Math.random() > 0.4 ? 'Sunny' : 'Cloudy'
        }));

        res.json({ temp, condition, humidity, windSpeed, suggestion, location, forecast });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch weather data' });
    }
});

module.exports = router;
