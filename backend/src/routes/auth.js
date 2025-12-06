const express = require('express');
const router = express.Router();
const { login, getCurrentAdmin, updatePassword } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

// Public routes
router.post('/login', login);

// Protected routes
router.get('/me', authMiddleware, getCurrentAdmin);
router.put('/password', authMiddleware, updatePassword);

module.exports = router;
