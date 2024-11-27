const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

// Login route
router.post('/login', AuthController.login);

// Sign-up route
router.post('/signup', AuthController.signUp);

module.exports = router;
