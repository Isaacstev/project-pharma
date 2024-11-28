const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

// Login route
router.post('/login', AuthController.login);

// Sign-up route
router.post('/signup', AuthController.signUp);

// Route to fetch user details by userId
//router.get('/user/:userId', AuthController.getUserDetails);

module.exports = router;
