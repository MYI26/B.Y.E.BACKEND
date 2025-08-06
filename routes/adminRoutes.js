const express = require('express');
const router = express.Router();        // Création d'un routeur Express
const authMiddleware = require('../middlewares/authMiddleware');        // Importation du middleware d'authentification
const adminMiddleware = require('../middlewares/adminMiddleware');      // Importation du middleware d'administration   

router.get('/dashboard', authMiddleware, adminMiddleware, (req, res) => {      // Route pour le tableau de bord admin, accessible uniquement aux admins
  res.json({ message: 'Bienvenue admin !' });
});

module.exports = router;
