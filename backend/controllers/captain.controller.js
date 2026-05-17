const captainModel = require('../models/captain.model');
const { validationResult } = require('express-validator');

module.exports = {
    // 1. CAPTAIN REGISTRATION
    register: async (req, res) => {
        // Catch any express-validator errors from the route
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // Include vehicleType and capacity from the request body
            const { name, email, password, vehicleType, capacity } = req.body;

            // Manual fallback check to ensure all fields are provided
            if (!name || !email || !password || !vehicleType || !capacity) {
                return res.status(400).json({ message: 'Please fill in all fields' });
            }

            // Check if the captain already exists
            let captain = await captainModel.findOne({ email }).select('+password');
            if (captain) {
                return res.status(400).json({ message: 'Captain already exists' });
            }

            // Create the new captain with vehicle details
            captain = new captainModel({
                name,
                email,
                password,
                vehicleType,
                capacity
            });

            await captain.save();   

            // Generate a JWT token
            const token = captain.generateAuthToken();
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 3600000
            });

            // Strip password out of the response for security
            captain.password = undefined;

            return res.status(201).json({ token, captain });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }  
    }
};