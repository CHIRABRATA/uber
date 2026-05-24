const rideService = require('../services/ride.service');
const captainModel = require('../models/captain.model'); // To query nearby captains
const { userSocketMap } = require('../socket'); // Import our active socket registry
const { validationResult } = require('express-validator');

module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { pickup, destination, pickupCoords, destCoords, vehicleType, fare, distance, duration } = req.body;

        // 1. Save the pending ride request to MongoDB
        const ride = await rideService.createRide({
            user: req.user.id,
            pickup,
            destination,
            pickupCoords,
            destCoords,
            vehicleType,
            fare,
            distance,
            duration
        });

        // 2. GEOSPATIAL LOOKUP: Find drivers within a 5km radius
        // MongoDB requires coordinates in [longitude, latitude] order for Geospatial queries
        const nearbyCaptains = await captainModel.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [pickupCoords[1], pickupCoords[0]] // [longitude, latitude]
                    },
                    $maxDistance: 5000 // 5000 meters = 5km radius
                }
            },
            status: 'available', // Only send to available drivers
            vehicleType: vehicleType // Only match requested car types (e.g., auto, car)
        });

        // Grab access to the global socket io instance attached to your app setup
        const io = req.app.get('io'); 

        // 3. BROADCAST: Send ride request to all found active nearby drivers
        nearbyCaptains.forEach(captain => {
            const captainSocketId = userSocketMap.get(captain._id.toString());
            if (captainSocketId) {
                io.to(captainSocketId).emit('new-ride-request', {
                    rideId: ride._id,
                    pickup,
                    destination,
                    fare,
                    distance,
                    duration,
                    userName: req.user.fullname // Send basic rider info
                });
            }
        });

        return res.status(201).json({ message: "Searching for drivers...", rideId: ride._id });

    } catch (error) {
        console.error("Ride creation error:", error);
        return res.status(500).json({ message: error.message });
    }
};