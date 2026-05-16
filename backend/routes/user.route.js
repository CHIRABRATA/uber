const express= require('express');
const router=express.Router();
const User=require('../models/user.model');
const{body,validationResult}=require('express-validator');
// Register a new user post method here only have the route in controller have the logic
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middlewares');

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


//lagin route is from here 

router.post('/login',[
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // Call the login function from the controller
    await userController.login(req, res);
});


//profile route is from here
//in postman will be http://localhost:3000/api/users/profile

router.get('/profile', authMiddleware.auth, userController.profile);

//logout route is from here
router.post('/logout', userController.logout);


module.exports=router;