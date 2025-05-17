const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'caca'; // ou ta clé réelle

module.exports = function authenticateToken(req, res, next) {
  console.log("🔐 Vérification du token...");

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log("❌ Aucun token fourni.");
    return res.status(401).json({ message: 'Token manquant' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log("✅ Token valide. Payload :", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ Token invalide :", err.message);
    return res.status(403).json({ message: 'Token invalide' });
  }
};