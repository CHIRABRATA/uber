const mongoose = require('mongoose');

const captainSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"],
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['rider', 'driver'],
        required: true
    }
}, { timestamps: true });

const Captain = mongoose.model('Captain', captainSchema);