const usermodel=require('../models/user.model');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');


module.exports.createUser=async(name,email,password,role)=>{

    try {
        // Check if the user already exists
        let user = await usermodel.findOne({ email }).select('+password');
        if (user) {
            throw new Error('User already exists');
        }

        // Create a new user
        user = new usermodel({ name, email, password, role });
        await user.save();
        // Generate a JWT token
        const token = user.generateAuthToken();
        return { token, user };
    } catch (error) {
        console.error(error);
        throw new Error('Server error');
    }
    
}