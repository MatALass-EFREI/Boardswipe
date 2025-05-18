const express = require('express');
const router = express.Router();
const quizRepository = require('../utils/quiz.repository');
const authenticateToken = require('../utils/auth.middleware');

router.get('/all', async (req, res) => {
    try {
        const quizzes = await quizRepository.getAllQuizzes();
        res.json(quizzes);
    } catch (err) {
        console.error('Erreur lors de la récupération des quiz :', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const quiz = await quizRepository.getQuizById(req.params.id);
        if (!quiz) return res.status(404).json({ error: 'Quiz non trouvé' });
        res.json(quiz);
    } catch (err) {
        console.error('Erreur lors de la récupération du quiz :', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

router.post('/quiz', async (req, res) => {
    try {
        const { id_quiz, quiz_title, questions } = req.body;
        if (!id_quiz || !quiz_title || !questions) {
            return res.status(400).json({ error: 'Champs requis manquants' });
        }

        const newId = await quizRepository.addQuiz({ id_quiz, quiz_title, questions });
        res.status(201).json({ message: 'Quiz ajouté', id: newId });
    } catch (err) {
        console.error('Erreur lors de l’ajout du quiz :', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

router.delete('/quiz/:id', async (req, res) => {
    try {
        const deleted = await quizRepository.deleteQuizById(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Quiz non trouvé' });
        res.json({ message: 'Quiz supprimé' });
    } catch (err) {
        console.error('Erreur lors de la suppression du quiz :', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});
router.post('/submit', authenticateToken, async (req, res) => {
    try {
        const { id_user, id_quiz, score, time } = req.body;

        if (!id_user || !id_quiz || score === undefined || time === undefined) {
            return res.status(400).json({ error: 'Champs requis manquants' });
        }

        await quizRepository.updateUserQuizResult(id_user, id_quiz, score, time);
        res.status(200).json({ message: 'Résultat enregistré avec succès' });
    } catch (err) {
        console.error('Erreur lors de l’enregistrement du résultat :', err);
        res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
});
router.get('/leaderboard/:quizId', async (req, res) => {
    try {
        const leaderboard = await quizRepository.getLeaderboardByQuizId(req.params.quizId);
        res.json(leaderboard);
    } catch (err) {
        console.error('Erreur lors de la récupération du leaderboard :', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

module.exports = router;
