const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const rideController = require('../controllers/ride.controller');
const authMiddleware = require('../middlewares/auth.middlewares'); // Ensure path is correct

router.post('/create',
    authMiddleware.auth, // Protects the route—only authenticated riders can book a ride
    [
        body('pickup').isString().notEmpty().withMessage('Invalid pickup address'),
        body('destination').isString().notEmpty().withMessage('Invalid destination address'),
        body('pickupCoords').isArray().withMessage('Pickup coordinates must be an array [lat, lng]'),
        body('destCoords').isArray().withMessage('Destination coordinates must be an array [lat, lng]'),
        body('vehicleType').isIn(['car', 'motorcycle', 'bicycle']).withMessage('Invalid vehicle type'),
        body('fare').isNumeric().withMessage('Fare must be a number'),
        body('distance').isNumeric().withMessage('Distance must be a number'),
        body('duration').isNumeric().withMessage('Duration must be a number')
    ],
    rideController.createRide
);

module.exports = router;