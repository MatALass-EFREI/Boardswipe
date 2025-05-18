const express = require('express');
const router = express.Router();
const usersRepository = require('../utils/users.repository');
const authenticateToken = require('../utils/auth.middleware');

// Route to retrieve user profile by ID
router.get('/profile/:id', authenticateToken, async (req, res) => {
    const userId = req.params.id;

    console.log("📥 Received in /user/profile/:id:", { userId });

    // Validate the user ID
    if (!userId) {
        console.log("🔴 Invalid data:", { userId });
        return res.status(400).json({ error: 'Invalid request data' });
    }

    try {
        console.log("✅ Calling getUserData with:", userId);
        const userProfile = await usersRepository.getUserData(userId);

        if (!userProfile) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(userProfile);
    } catch (error) {
        console.error('❌ SQL Error in /profile/:id:', error);
        res.status(500).json({ error: 'Error retrieving user profile' });
    }
});

module.exports = router;