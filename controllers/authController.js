const User = require('../models/User');     // Importation du modèle User
const bcrypt = require('bcryptjs'); // Importation de bcrypt pour le hachage des mots de passe
const jwt = require('jsonwebtoken');    // Importation de jsonwebtoken pour la création de tokens JWT

exports.signup = async (req, res) => {          // Fonction pour l'inscription d'un utilisateur
  const { email, password } = req.body;     

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email déjà utilisé' });

    // Hasher le mot de passe/ pour + de sécurité
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const newUser = await User.create({ email, password: hashedPassword });

    // Créer un token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'Utilisateur créé', token });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.login = async (req, res) => {       // Fonction pour la connexion d'un utilisateur
  const { email, password } = req.body;

  try {
    // Vérifie si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Utilisateur non trouvé' });

    // Compare les mots de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Mot de passe incorrect' });

    // Crée un token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Connexion réussie', token });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
