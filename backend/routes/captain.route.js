const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

// FIX: Import the captain controller instead of the user controller
const captainController = require('../controllers/captain.controller');
const authMiddleware = require('../middlewares/auth.middlewares');

// 1. CAPTAIN REGISTRATION ROUTE (With detailed validations)
router.post('/register', [
    body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
    body('email').isEmail().withMessage('Please provide a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    
    // Vehicle Validations (Matching your schema exactly)
    body('vehicleType').isIn(['car', 'motorcycle', 'bicycle']).withMessage('Invalid vehicle type. Must be car, motorcycle, or bicycle'),
    body('capacity').isInt({ min: 1 }).withMessage('Capacity must be a number and at least 1')
], captainController.register);

// 2. CAPTAIN LOGIN ROUTE
router.post('/login', [
    body('email').isEmail().withMessage('Please provide a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], captainController.login);

// 3. CAPTAIN LOGOUT ROUTE
router.post('/logout', captainController.logout);

// 4. GET CAPTAIN PROFILE ROUTE (Protected)
router.get('/profile', authMiddleware.captain, captainController.getProfile);

module.exports = router;
