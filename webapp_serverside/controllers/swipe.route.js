const express = require('express');
const router = express.Router();
const swipeRepository = require('../utils/swipe.repository');

// Route pour récupérer le premier jeu
router.get('/first', async (req, res) => {
    try {
        const game = await swipeRepository.getFirstGame();
        console.log(game);
        res.json(game);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération du premier jeu' });
    }
});
// Route pour récupérer un jeu aléatoire
router.get('/random', async (req, res) => {
    try {
        const game = await swipeRepository.getRandomGame();
        console.log(game);
        res.json(game);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération du jeu aléatoire' });
    }
});

// Route pour enregistrer un swipe
router.post('/save', async (req, res) => {
    const { id_game, id_user, result } = req.body;
    try {
        if (!id_game || !id_user || result === undefined) {
            return res.status(400).json({ error: 'Invalid request data' });
        }
        await swipeRepository.saveSwipe(id_game, id_user, result);
        res.status(200).json({ message: 'Swipe enregistré avec succès' });
    } catch (error) {
        console.error('Error in /save route:', error);
        res.status(500).json({ error: 'Erreur lors de l\'enregistrement du swipe' });
    }
});

module.exports = router;