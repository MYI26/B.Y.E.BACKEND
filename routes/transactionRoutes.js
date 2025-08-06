const express = require('express');
const router = express.Router();
const { createTransaction, getUserTransactions } = require('../controllers/transactionController');
const authMiddleware = require('../middlewares/authMiddleware');

// Créer une transaction
router.post('/', authMiddleware, createTransaction);

// Récupérer l’historique de l'utilisateur connecté
router.get('/my', authMiddleware, getUserTransactions);

module.exports = router;
