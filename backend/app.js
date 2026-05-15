const express = require('express');
const app = express();
const connectDB = require('./db/db');
require('dotenv').config();


app.get('/', (req, res) => {
    res.send('Hello World!');
});

connectDB();

const PORT = process.env.PORT || 3000;



module.exports = app;