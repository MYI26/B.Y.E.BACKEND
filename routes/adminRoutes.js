const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/adminMiddleware');
const {
  getAllUsers,
  getUserTransactions,
  deleteUser
} = require('../controllers/adminController');

// Voir tous les utilisateurs
router.get('/users', auth, isAdmin, getAllUsers);

// Voir l’historique d’un utilisateur donné
router.get('/users/:userId/transactions', auth, isAdmin, getUserTransactions);

// Supprimer un utilisateur
router.delete('/users/:userId', auth, isAdmin, deleteUser);

module.exports = router;
