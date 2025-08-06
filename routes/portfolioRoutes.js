const express = require('express');
const router = express.Router();
const { getPortfolio } = require('../controllers/portfolioController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, getPortfolio);

module.exports = router;
