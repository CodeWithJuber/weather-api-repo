const express = require('express');
const router = express.Router();
const { getAllPublicContent } = require('../controllers/publicController');

// Public routes - no auth required
router.get('/content', getAllPublicContent);

module.exports = router;
