const express = require('express');
const router = express.Router();
const { getStockData } = require('../controllers/stockController');     // Importation du contrôleur pour récupérer les données des actions

router.get('/:symbol', getStockData);     // Route pour récupérer les données d'une action par son symbole

module.exports = router;
