const express= require('express');
const router=express.Router();
const User=require('../models/user.model');
const{body,validationResult}=require('express-validator');
// Register a new user post method here only have the route in controller have the logic

router.post('/register',[
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({min:6}).withMessage('Password must be at least 6 characters long'),
    body('role').isIn(['rider','driver']).withMessage('Role must be either rider or driver')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // Call the register function from the controller
    await userController.register(req, res);
});

module.exports=router;