const express = require('express');     // Importation d'Express
const router = express.Router();        // Création d'un routeur Express
const { signup, login } = require('../controllers/authController');        // Importation des fonctions de contrôle pour l'authentification

router.post('/signup', signup);         // Route pour l'inscription d'un utilisateur
router.post('/login', login);            // Route pour la connexion d'un utilisateur

module.exports = router;            // Exportation du routeur pour l'utiliser dans le fichier principal du serveur
