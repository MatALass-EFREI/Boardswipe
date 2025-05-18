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
// Route to retrieve user swipe data by ID
router.get('/swipe/:id', authenticateToken, async (req, res) => {
    const userId = req.params.id;

    console.log("📥 Received in /user/swipe/:id:", { userId });

    // Validate the user ID
    if (!userId) {
        console.log("🔴 Invalid data:", { userId });
        return res.status(400).json({ error: 'Invalid request data' });
    }

    try {
        console.log("✅ Calling getUserSwipeData with:", userId);
        const userSwipeData = await usersRepository.getUserSwipeData(userId);

        if (!userSwipeData) {
            return res.status(404).json({ error: 'User swipe data not found' });
        }

        res.status(200).json(userSwipeData);
    } catch (error) {
        console.error('❌ SQL Error in /swipe/:id:', error);
        res.status(500).json({ error: 'Error retrieving user swipe data' });
    }
});
// Route to change user description

router.put('/description/:id', authenticateToken, async (req, res) => {
    const userId = req.params.id;
    const { description } = req.body;

    console.log("📥 Received in /user/description/:id:", { userId, description });

    // Validate the user ID and description
    if (!userId || !description) {
        console.log("🔴 Invalid data:", { userId, description });
        return res.status(400).json({ error: 'Invalid request data' });
    }

    try {
        console.log("✅ Updating user description for ID:", userId);
        await usersRepository.updateUserDescription(userId, description);
        res.status(200).json({ message: 'User description updated successfully' });
    } catch (error) {
        console.error('❌ SQL Error in /description/:id:', error);
        res.status(500).json({ error: 'Error updating user description' });
    }
});

module.exports = router;