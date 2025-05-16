const express = require('express');
const { login, register } = require('../controllers/authController');
const jwtMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const authController = require('../controllers/authController');

// Middleware for handling JWT tokens
router.use(jwtMiddleware);

// GET requests
router.get('/register', authController.register_get);
router.get('/login', authController.login_get);

router.get('/logout', authController.logout_get);

// POST requests
router.post('/login', authController.login_post);
router.post('/register', authController.register_post);

module.exports = router;