const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bycript = require('bcrypt');

//this middleware will be used to protect routes that require authentication.
//  It will check for the presence of a JWT token in the request headers or cookies, 
// verify the token, and attach the decoded user information to the request 
// object for use in subsequent middleware or route handlers. 
// If the token is missing or invalid, it will return a 401 Unauthorized response.

module.exports = {
    auth: async (req, res, next) => {
        const token = req.cookies?.token || req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }   
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Token is not valid' });
        }
    }
};