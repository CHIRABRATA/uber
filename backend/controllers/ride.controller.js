const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
// Controller function to handle ride creation requests
//this controller 
//1. Validates incoming request data using express-validator
//2. Calls the ride service to create a new ride with the provided details and the authenticated user's ID
//3. Handles success and error responses appropriately, sending back the created ride or error messages as needed

module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { pickup, destination, pickupCoords, destCoords, vehicleType, fare, distance, duration } = req.body;

        const ride = await rideService.createRide({
            user: req.user.id, // Pulled straight from your auth middleware payload!
            pickup,
            destination,
            pickupCoords,
            destCoords,
            vehicleType,
            fare,
            distance,
            duration
        });

        return res.status(201).json(ride);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};