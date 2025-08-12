const User = require('../models/User');     // Importation du modèle User

const adminMiddleware = async (req, res, next) => {         // Middleware pour vérifier si l'utilisateur est un administrateur
  try {
    const user = await User.findById(req.user.userId);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access forbidden (admin only)' });
    }

    next();         // Passe à la prochaine fonction middleware ou route
  } catch (err) {
    res.status(500).json({ message: 'Server error (adminMiddleware)' });
  }
};

module.exports = adminMiddleware;
