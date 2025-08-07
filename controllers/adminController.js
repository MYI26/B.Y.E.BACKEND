const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Voir tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -__v');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Voir transactions d’un utilisateur donné
exports.getUserTransactions = async (req, res) => {
  const userId = req.params.userId;

  try {
    const transactions = await Transaction.find({ userId }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Supprimer un compte utilisateur
exports.deleteUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    await Transaction.deleteMany({ userId });
    res.json({ message: 'Utilisateur et transactions supprimés' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
