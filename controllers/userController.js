const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password -__v');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.updateEmail = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email requis' });

  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    const emailUsed = await User.findOne({ email });
    if (emailUsed && emailUsed._id.toString() !== user._id.toString()) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    user.email = email;
    await user.save();
    res.json({ message: 'Email mis à jour', email: user.email });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.updatePassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  if (!email || !oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    if (user.email !== email) {
      return res.status(403).json({ message: 'Email incorrect' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Ancien mot de passe incorrect' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.deleteMe = async (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ message: 'Mot de passe requis' });

  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    await User.findByIdAndDelete(req.user.userId);
    res.json({ message: 'Compte supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
