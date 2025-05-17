const express = require('express');
const router = express.Router();
const gamesRepo = require('../utils/games.repository');

router.get('/sort', async (req, res) => {
    try {
        const { column = 'gameName', order = 'ASC' } = req.query;
        console.log("Received query params:", { column, order });

        // Fetch sorted games from the repository
        const games = await gamesRepo.getGamesSortedBy(column, order);
        console.log("First two games from repository:", games.slice(0, 2));

        // Format the response
        const formattedGames = games.map(game => ({
            id: game.id,
            name: game.name,
            releaseDate: game.releaseDate,
            rating: game.rating || 'N/A' // Handle null ratings
        }));
        console.log("Formatted games:", formattedGames.slice(0, 2)); // Log only the first two formatted games

        res.json(formattedGames);
    } catch (error) {
        console.error("Error in /games/sort route:", error);
        res.status(500).json({ success: false, message: 'Failed to fetch sorted games' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const gameId = req.params.id;
        console.log(`Fetching details for game ID: ${gameId}`);

        const game = await gamesRepo.getGameById(gameId);

        if (!game) {
            return res.status(404).json({ success: false, message: 'Game not found' });
        }
        res.json(game);
    } catch (error) {
        console.error("Error in /games/:id route:", error);
        res.status(500).json({ success: false, message: 'Failed to fetch game details' });
    }
});

module.exports = router;