const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bycript = require('bcrypt');
const TokenBlacklist = require('../models/tokenBlacklist.model');

//this middleware will be used to protect routes that require authentication.
//  It will check for the presence of a JWT token in the request headers or cookies, 
// verify the token, and attach the decoded user information to the request 
// object for use in subsequent middleware or route handlers. 
// If the token is missing or invalid, it will return a 401 Unauthorized response.

module.exports = {
    extractToken: (req) => {
        const cookieHeader = req.headers.cookie || '';
        const cookieToken = cookieHeader
            .split(';')
            .map(cookie => cookie.trim())
            .find(cookie => cookie.startsWith('token='))
            ?.slice('token='.length);

        return req.cookies?.token || cookieToken || req.header('Authorization')?.replace('Bearer ', '').trim();
    },
    auth: async (req, res, next) => {
        const token = module.exports.extractToken(req);
        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }   
        try {
            const blacklistedToken = await TokenBlacklist.findOne({ token });
            if (blacklistedToken) {
                return res.status(401).json({ message: 'Token has been revoked' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Token is not valid' });
        }
    }
};