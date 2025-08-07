const express = require('express');
const router = express.Router();
const { getStockData } = require('../controllers/stockController');     // Importation du contrôleur pour récupérer les données des actions
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/:symbol', authMiddleware, getStockData);     // Route pour récupérer les données d'une action par son symbole

module.exports = router;
