const captainModel = require('../models/captain.model');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const TokenBlacklist = require('../models/tokenBlacklist.model');
const authMiddleware = require('../middlewares/auth.middlewares');

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
    },

    // 2. CAPTAIN LOGIN
    login: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: 'Please fill in all fields' });
            }

            const captain = await captainModel.findOne({ email }).select('+password');
            if (!captain) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const isMatch = await captain.comparePassword(password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const token = captain.generateAuthToken();
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 3600000
            });

            return res.status(200).json({ message: 'Login successful', token });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    },

    //captain logout function is from here
    
    logout: async (req, res) => {
        try {
            const token = authMiddleware.extractToken(req);
//here we are blacklisting the token by storing it in the database with its expiration time,
//  so that we can check against this blacklist for any incoming requests
//  to ensure that the token is not valid anymore.
            if (token) {
                const decoded = jwt.decode(token);
                if (decoded?.exp) {
                    await TokenBlacklist.findOneAndUpdate(
                        { token },
                        { token, expiresAt: new Date(decoded.exp * 1000) },
                        { upsert: true, new: true, setDefaultsOnInsert: true }
                    );
                }
            }

            res.clearCookie('token');
            return res.status(200).json({ message: 'Logout successful' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    },

    // 3. GET CAPTAIN PROFILE (Protected Route)
    getProfile: async (req, res) => {
        try {
            const captainId = req.captain.id;
            const captain = await captainModel.findById(captainId);
            
            if (!captain) {
                return res.status(404).json({ message: 'Captain not found' });
            }

            return res.status(200).json({ captain });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    }
};