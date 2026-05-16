const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const services = require('../services/user.service');
const { validationResult } = require('express-validator');
const { stack } = require('../app');

module.exports = {
    // 1. REGISTER FUNCTION
    register: async (req, res) => {
        const { name, email, password, role } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            if (!name || !email || !password || !role) {
                return res.status(400).json({ message: 'Please fill in all fields' });
            }

            // Check if the user already exists
            let user = await userModel.findOne({ email }).select('+password');
            if (user) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Create a new user
            user = new userModel({ name, email, password, role });
            await user.save();

            // Generate a JWT token
            const token = user.generateAuthToken();
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 3600000
            });

            return res.status(201).json({ token, user });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    },

    // 2. LOGIN FUNCTION
    login: async (req, res) => {
        const { email, password } = req.body;
        const errors = validationResult(req);   
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // Check if the user exists
            const user = await userModel.findOne({ email }).select('+password');
            if (!user) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // Compare the provided password with the hashed password in the database
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // Generate a JWT token
            const token = user.generateAuthToken();
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

  
  // 3. PROFILE FUNCTION
    profile: async (req, res) => {
        try {   
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const user = await userModel.findById(req.user.id).select('-password');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.status(200).json({ user });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    },

    // 4. LOGOUT FUNCTION
    logout: async (req, res) => {
        try {
            res.clearCookie('token');
            return res.status(200).json({ message: 'Logout successful' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }
    }
};