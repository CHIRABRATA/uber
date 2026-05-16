require('dotenv').config();

const express = require('express');

const app = express();

const connectDB = require('./db/db');

const userRoutes = require('./routes/user.route');


app.use(express.json());
//path name is /api/users/register for register route and /api/users/login for login route
app.use('/api/users', userRoutes);


app.get('/', (req, res) => {
    res.send('Hello World!');
});

connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;