const rideModel = require('../models/ride.model');
const crypto = require('crypto');

// Generate a secure 4-digit numeric OTP for ride verification
module.exports.getOtp = (num = 4) => {
    const min = Math.pow(10, num - 1);
    const max = Math.pow(10, num) - 1;
    return crypto.randomInt(min, max).toString();
};

module.exports.createRide = async ({ user, pickup, destination, pickupCoords, destCoords, vehicleType, fare, distance, duration }) => {
    if (!user || !pickup || !destination || !pickupCoords || !destCoords || !vehicleType || !fare) {
        throw new Error('All fields are required');
    }

    // Generate the verification OTP
    const otp = module.exports.getOtp(4);

    const ride = await rideModel.create({
        user,
        pickup,
        destination,
        pickupCoords: {
            type: 'Point',
            coordinates: [pickupCoords[1], pickupCoords[0]] // [longitude, latitude]
        },
        destinationCoords: {
            type: 'Point',
            coordinates: [destCoords[1], destCoords[0]] // [longitude, latitude]
        },
        fare,
        distance,
        duration,
        vehicleType,
        otp
    });

    return ride;
};