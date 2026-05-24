const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    // 1. References to Users and Captains
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    captain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Captain',
        default: null // Stays null until a driver accepts the ride
    },

    // 2. Pickup Location Details
    pickup: {
        type: String,
        required: true // e.g., "Salt Lake, Sector V"
    },
    pickupCoords: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude] - MongoDB order!
            required: true
        }
    },

    // 3. Destination Location Details
    destination: {
        type: String,
        required: true // e.g., "Howrah Station"
    },
    destinationCoords: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    },

    // 4. Ride Financials & Logistics
    fare: {
        type: Number,
        required: true
    },
    duration: {
        type: Number, // In minutes (passed from OSRM data)
        required: true
    },
    distance: {
        type: Number, // In kilometers (passed from OSRM data)
        required: true
    },
    vehicleType: {
        type: String,
        enum: ['car', 'motorcycle', 'bicycle'], // Maps to captain's capabilities
        required: true
    },

    // 5. State Machine Management
    status: {
        type: String,
        enum: ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'],
        default: 'pending'
    },

    // 6. OTP Security for Safe Pickups
    otp: {
        type: String,
        required: true,
        select: false // Only fetched explicitly when checking during pickup verification
    },

    // 7. Payment Metadata
    paymentId: {
        type: String,
        default: null
    },
    orderId: {
        type: String,
        default: null
    },
    signature: {
        type: String,
        default: null
    }
}, { timestamps: true });

// Index both location coordinates for ultra-fast geospatial calculations later
rideSchema.index({ pickupCoords: '2dsphere' });
rideSchema.index({ destinationCoords: '2dsphere' });

const Ride = mongoose.model('Ride', rideSchema);

module.exports = Ride;