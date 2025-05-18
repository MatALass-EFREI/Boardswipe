const express = require('express');
const router = express.Router();
const pool = require('../utils/db.include');
const authenticateToken = require('../utils/auth.middleware');
const isAdmin = require('../utils/isAdmin.middleware');

router.get('/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id_user, userName, userEmail, role FROM user_');
    res.json(rows);
  } catch (err) {
    console.error('Erreur admin/users :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;