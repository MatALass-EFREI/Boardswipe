const express = require('express');
const router = express.Router();
const swipeRepository = require('../utils/swipe.repository');
const authenticateToken = require('../utils/auth.middleware');
// Route pour récupérer le premier jeu

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


router.post('/save', authenticateToken, async (req, res) => {
  const { id_game, result } = req.body;
  const id_user = req.user?.id_user;

  console.log("📥 Reçu dans /swipe/save :", {
    id_game,
    result,
    id_user
  });

  // Validation des données
  if (!id_game || typeof result === 'undefined' || !id_user) {
    console.log("🔴 Données invalides :", { id_game, result, id_user });
    return res.status(400).json({ error: 'Invalid request data' });
  }

  try {
    console.log("✅ Appel de saveSwipe avec :", id_game, id_user, result);
    await swipeRepository.saveSwipe(id_game, id_user, result);
    res.status(200).json({ message: 'Swipe enregistré avec succès' });
  } catch (error) {
    console.error('❌ Erreur SQL dans /save :', error);
    res.status(500).json({ error: 'Erreur lors de l\'enregistrement du swipe' });
  }
});

module.exports = router;