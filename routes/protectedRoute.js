const express = require('express');
const router = express.Router();            // Création d'un routeur Express
const authMiddleware = require('../middlewares/authMiddleware');                // Importation du middleware d'authentification
const User = require('../models/User');             // Importation du modèle User

router.get('/me', authMiddleware, async (req, res) => {         // Route pour obtenir les informations de l'utilisateur connecté
  try {
    const user = await User.findById(req.user.userId).select('-password -__v'); // on cache le mot de passe et la version
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    res.json(user); // retourne l'objet complet (id, email, etc.)
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.patch('/me', authMiddleware, async (req, res) => {           // Route pour mettre à jour les informations de l'utilisateur connecté
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'Email requis' });

  try {
    const user = await User.findById(req.user.userId);          // Récupère l'utilisateur connecté
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    // Vérifie que l'email n'est pas déjà utilisé
    const emailUsed = await User.findOne({ email });
    if (emailUsed && emailUsed._id.toString() !== user._id.toString()) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    user.email = email;
    await user.save();          // Enregistre les modifications

    res.json({ message: 'Email mis à jour', email: user.email });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.delete('/me', authMiddleware, async (req, res) => {        // Route pour supprimer le compte de l'utilisateur connecté   
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: 'Mot de passe requis' });
  }

  try {
    const user = await User.findById(req.user.userId);          // Récupère l'utilisateur connecté
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    const isMatch = await bcrypt.compare(password, user.password);              // Compare le mot de passe fourni avec le mot de passe haché
    if (!isMatch) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    await User.findByIdAndDelete(req.user.userId);          // Supprime l'utilisateur de la base de données    
    res.json({ message: 'Compte supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


const bcrypt = require('bcryptjs');     // Importation de bcrypt pour le hachage des mots de passe

router.patch('/me/password', authMiddleware, async (req, res) => {          // Route pour mettre à jour le mot de passe de l'utilisateur connecté
  const { email, oldPassword, newPassword } = req.body;

  if (!email || !oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }

  try {
    const user = await User.findById(req.user.userId);          // Récupère l'utilisateur connecté
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    // Vérifie que l’email correspond
    if (user.email !== email) {
      return res.status(403).json({ message: 'Email incorrect' });
    }

    // Vérifie que l’ancien mot de passe est bon
    const isMatch = await bcrypt.compare(oldPassword, user.password);       // Compare l'ancien mot de passe avec le mot de passe haché
    if (!isMatch) {
      return res.status(401).json({ message: 'Ancien mot de passe incorrect' });
    }

    // Hash du nouveau mot de passe
    const hashed = await bcrypt.hash(newPassword, 10);          // Hache le nouveau mot de passe
    user.password = hashed;         // Met à jour le mot de passe de l'utilisateur
    await user.save();              // Enregistre les modifications

    res.json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;

