require('dotenv').config();

const express = require('express');

const app = express();

const connectDB = require('./db/db');

const userRoutes = require('./routes/user.route');


app.use(express.json());
//path name is /api/users/register for register route and /api/users/login for login route
app.use('/api/users', userRoutes);

//add the captain route here
app.use('/api/captains', require('./routes/captain.route'));

//add the ride route here

app.use('/api/rides', require('./routes/ride.route'));


app.get('/', (req, res) => {
    res.send('Hello World!');
});



connectDB();

module.exports = app;