const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    register: async (req, res) => {
        const { name, email, password, role } = req.body;
        try {
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
            res.status(201).json({ token });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }
};

