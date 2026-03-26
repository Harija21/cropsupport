const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const CommunityPost = require('../models/CommunityPost');

// GET /api/community
router.get('/', async (req, res) => {
    try {
        const posts = await CommunityPost.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch posts' });
    }
});

// POST /api/community
router.post('/', protect, async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) return res.status(400).json({ message: 'Title and content are required' });

        const post = await CommunityPost.create({
            user: req.user._id,
            authorName: req.user.name,
            title,
            content
        });

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create post' });
    }
});

module.exports = router;
