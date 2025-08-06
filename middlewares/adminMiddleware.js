const User = require('../models/User');     // Importation du modèle User

const adminMiddleware = async (req, res, next) => {         // Middleware pour vérifier si l'utilisateur est un administrateur
  try {
    const user = await User.findById(req.user.userId);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès interdit (admin uniquement)' });
    }

    next();         // Passe à la prochaine fonction middleware ou route
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur (adminMiddleware)' });
  }
};

module.exports = adminMiddleware;
