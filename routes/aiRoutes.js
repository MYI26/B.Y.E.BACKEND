const express = require('express');
const router = express.Router();
const { analyzePortfolio } = require('../controllers/aiController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/analyze', authMiddleware, analyzePortfolio);

module.exports = router;
