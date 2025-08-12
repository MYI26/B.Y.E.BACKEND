const jwt = require('jsonwebtoken');        // Importation de jsonwebtoken pour la vérification des tokens JWT

const authMiddleware = (req, res, next) => {        // Middleware pour vérifier l'authentification des utilisateurs
  const authHeader = req.headers.authorization;         // Récupère l'en-tête Authorization de la requête

  // Vérifie s’il y a un token dans l’en-tête Authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);      // Vérifie et décode le token
    req.user = decoded; // On peut récupérer req.user.userId après
    next();             // Passe à la prochaine fonction middleware ou route
  } catch (err) {
    res.status(401).json({ message: 'Token invalid.' });
  }
};

module.exports = authMiddleware;
