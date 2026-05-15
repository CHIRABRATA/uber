const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const services = require('../services/user.service');
const {validationResult} = require('express-validator');

module.exports = {
    register: async (req, res) => {
        const { name, email, password, role } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            //check all filed are filled or not
                if (!name || !email || !password || !role) {
                    return res.status(400).json({ message: 'Please fill in all fields' });
                }
            // Check if the user already exists
            let user = await userModel
                .findOne({ email })
                .select('+password');
            if (user) {
                return res.status(400).json({ message: 'User already exists' });
            }
            // Create a new user
            user = new userModel({
                name,
                email,
                password,
                role
            });
            await user.save();
            // Generate a JWT token
            const token = user.generateAuthToken();
            res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600000
});

res.status(201).json({ token });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }
};

