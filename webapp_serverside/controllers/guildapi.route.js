const express = require('express');
const router = express.Router();
const authenticateToken = require('../utils/auth.middleware');
const GuildRepository = require('../utils/guild.repository');
const db = require('../utils/db.include');

// Get all guilds
router.get('/all', async (req, res) => {
    try {
        const guilds = await GuildRepository.getAllGuilds();
        console.log('Fetched guilds from database:', guilds); // Log des données récupérées
        res.json(guilds);
    } catch (err) {
        console.error('Error fetching guilds:', err); // Log de l'erreur
        res.status(500).json({ error: 'Failed to fetch guilds' });
    }
});

// Get user's guild
router.get('/my', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id_user;
        const guild = await GuildRepository.getGuildByUserId(userId);
        console.log('Fetched user guild:', guild); // Log the response
        res.json(guild);
    } catch (err) {
        console.error('Error fetching user guild:', err);
        res.status(500).json({ error: 'Failed to fetch user guild' });
    }
});

// Create a guild
router.post('/create', authenticateToken, async (req, res) => {
    try {
        const { name, isPublic } = req.body; // Accept isPublic parameter
        const userId = req.user.id_user;
        const guild = await GuildRepository.createGuild(name, userId, isPublic);
        res.status(201).json(guild);
    } catch (err) {
        console.error('Error creating guild:', err);
        res.status(500).json({ error: 'Failed to create guild' });
    }
});

// Get guild members
router.get('/:id/members', authenticateToken, async (req, res) => {
    try {
        const guildId = req.params.id;
        const members = await GuildRepository.getGuildMembers(guildId);
        res.json(members);
    } catch (err) {
        console.error('Error fetching guild members:', err);
        res.status(500).json({ error: 'Failed to fetch guild members' });
    }
});

// Handle join requests
router.get('/:id/requests', authenticateToken, async (req, res) => {
    try {
        const guildId = req.params.id;
        const requests = await GuildRepository.getJoinRequests(guildId);
        res.json(requests);
    } catch (err) {
        console.error('Error fetching join requests:', err);
        res.status(500).json({ error: 'Failed to fetch join requests' });
    }
});
// Add this route in webapp_serverside/controllers/guildapi.route.js
router.post('/:id/join', authenticateToken, async (req, res) => {
    try {
        const guildId = req.params.id;
        const userId = req.user.id_user;

        const guild = await GuildRepository.getGuildById(guildId);
        if (!guild) {
            return res.status(404).json({ error: 'Guild not found' });
        }

        if (guild.isPublic) {
            // Add the user directly to the guild
            await GuildRepository.addMemberToGuild(userId, guildId, 'member');
            res.status(200).json({ message: 'Successfully joined the guild' });
        } else {
            // Add the user as a requester
            await GuildRepository.addMemberToGuild(userId, guildId, 'demandeur');
            res.status(200).json({ message: 'Join request sent to the guild' });
        }
    } catch (err) {
        console.error('Error joining guild:', err);
        res.status(500).json({ error: 'Failed to join the guild' });
    }
});

// Add this route in webapp_serverside/controllers/guildapi.route.js
router.post('/:id/remove', authenticateToken, async (req, res) => {
    try {
        const guildId = req.params.id;
        const { userId } = req.body;

        // Ensure the userId is provided
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        // Remove the user from the guild
        await GuildRepository.removeMemberFromGuild(userId, guildId);

        res.status(200).json({ message: 'Member removed successfully' });
    } catch (err) {
        console.error('Error removing member from guild:', err);
        res.status(500).json({ error: 'Failed to remove member from guild' });
    }
});

// Add this route in webapp_serverside/controllers/guildapi.route.js
router.post('/:id/promote', authenticateToken, async (req, res) => {
    try {
        const guildId = req.params.id;
        const { userId } = req.body;
        const currentUserId = req.user.id_user;

        // Ensure the userId is provided
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        // Check if the current user is the president of the guild
        const currentPresident = await GuildRepository.getGuildByUserId(currentUserId);
        if (!currentPresident || currentPresident.role !== 'president' || currentPresident.id_guild !== parseInt(guildId)) {
            return res.status(403).json({ error: 'Only the current president can promote another member' });
        }

        // Update roles: demote current president and promote the new president
        await GuildRepository.updateRole(currentUserId, guildId, 'member');
        await GuildRepository.updateRole(userId, guildId, 'president');

        res.status(200).json({ message: 'Member promoted to president successfully' });
    } catch (err) {
        console.error('Error promoting member to president:', err);
        res.status(500).json({ error: 'Failed to promote member to president' });
    }
});
// Add this route in webapp_serverside/controllers/guildapi.route.js
router.post('/:id/leave', authenticateToken, async (req, res) => {
    try {
        const guildId = req.params.id;
        const userId = req.user.id_user;

        // Remove the user from the guild
        await GuildRepository.removeMemberFromGuild(userId, guildId);

        res.status(200).json({ message: 'Successfully left the guild' });
    } catch (err) {
        console.error('Error leaving guild:', err);
        res.status(500).json({ error: 'Failed to leave the guild' });
    }
});

router.post('/:id/accept', authenticateToken, async (req, res) => {
    try {
        const guildId = req.params.id;
        const { userId } = req.body;

        await GuildRepository.updateRole(userId, guildId, 'member');
        res.status(200).json({ message: 'Request accepted' });
    } catch (err) {
        console.error('Error accepting request:', err);
        res.status(500).json({ error: 'Failed to accept request' });
    }
});

router.post('/:id/reject', authenticateToken, async (req, res) => {
    try {
        const guildId = req.params.id;
        const { userId } = req.body;

        await GuildRepository.removeMemberFromGuild(userId, guildId);
        res.status(200).json({ message: 'Request rejected' });
    } catch (err) {
        console.error('Error rejecting request:', err);
        res.status(500).json({ error: 'Failed to reject request' });
    }
});


// Fetch messages for a guild
router.get('/:id/messages', authenticateToken, async (req, res) => {
    try {
        const guildId = req.params.id;
        const userId = req.user.id_user;

        // Check if the user belongs to the guild
        const userGuild = await GuildRepository.getGuildByUserId(userId);
        if (!userGuild || userGuild.id_guild !== parseInt(guildId)) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Fetch messages for the guild
        const query = `
            SELECT m.id_chat, m.message_text, m.message_date, u.userName
            FROM Message m
            JOIN User_ u ON m.id_user = u.id_user
            WHERE m.id_guild = ?
            ORDER BY m.message_date ASC`;
        const [messages] = await db.query(query, [guildId]);

        res.status(200).json(messages);
    } catch (err) {
        console.error('Error fetching messages:', err);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

// Post a message to the guild chat
router.post('/:id/messages', authenticateToken, async (req, res) => {
    try {
        const guildId = req.params.id;
        const userId = req.user.id_user;
        const { message_text } = req.body;

        // Check if the user belongs to the guild
        const userGuild = await GuildRepository.getGuildByUserId(userId);
        if (!userGuild || userGuild.id_guild !== parseInt(guildId)) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Insert the message into the database
        const query = `
            INSERT INTO Message (id_chat, message_text, message_date, id_guild, id_user)
            VALUES (UUID(), ?, NOW(), ?, ?)`;
        await db.query(query, [message_text, guildId, userId]);

        res.status(201).json({ message: 'Message sent successfully' });
    } catch (err) {
        console.error('Error posting message:', err);
        res.status(500).json({ error: 'Failed to post message' });
    }
});

module.exports = router;