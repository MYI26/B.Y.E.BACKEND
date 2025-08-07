const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const {
  getMe,
  updateEmail,
  updatePassword,
  deleteMe
} = require('../controllers/userController');

router.get('/me', authMiddleware, getMe);
router.patch('/me', authMiddleware, updateEmail);
router.patch('/me/password', authMiddleware, updatePassword);
router.delete('/me', authMiddleware, deleteMe);

module.exports = router;
