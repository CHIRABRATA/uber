const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const captainSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"],
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    status: {
        type: String,
        enum: ['available', 'unavailable'],
        default: 'unavailable'
    },
    // UPGRADED TO GEOJSON: Crucial for finding the nearest drivers
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude] - MongoDB expects longitude first!
            index: '2dsphere' // Creates a geospatial index for rapid distance sorting
        }
    },
    capacity: { // Fixed typo from 'capacitry'
        type: Number,
        required: true
    },
    vehicleType: { // Fixed typo from 'type_vachicle' and formatted to camelCase
        type: String,
        enum: ['car', 'motorcycle', 'bicycle'],
        required: true
    },
    socketId: { // Fixed typo from 'scoketId'
        type: String,
        default: null
    },
    role: {
        type: String,
        enum: ['rider', 'driver'],
        default: 'driver' // Defaulting to driver since this is the Captain schema
    }
}, { timestamps: true });

// Hash the password before saving the captain
captainSchema.pre('save', async function() {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Generate JWT token for authentication
captainSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
};

// Compare the provided password with the hashed password in the database
captainSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const Captain = mongoose.model('Captain', captainSchema);

// ADDED THIS: Node needs this line to allow other files to import the model
module.exports = Captain;