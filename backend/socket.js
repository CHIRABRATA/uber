const socketIo = require('socket.io');
const captainModel = require('./models/captain.model'); // Adjust path to your driver model

// Keep track of active connections: { userId/captainId: socketId }
const userSocketMap = new Map();

const initializeSocket = (server) => {
    const io = socketIo(server, {
        cors: {
            origin: "*", // Adjust this to match your frontend port in production (e.g., http://localhost:5173)
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        // 1. Listen for users/drivers joining and register their identity
        socket.on('join', async (data) => {
            const { userId, userType } = data; // userType can be 'user' or 'captain'
            userSocketMap.set(userId, socket.id);
            console.log(`${userType} registered: ${userId} with socket: ${socket.id}`);

            // If it's a driver, make sure they are updated as online in DB
            if (userType === 'captain') {
                await captainModel.findByIdAndUpdate(userId, { socketId: socket.id, status: 'available' });
            }
        });

        // 2. Handle disconnection cleanup
        socket.on('disconnect', async () => {
            console.log(`Client disconnected: ${socket.id}`);
            for (let [userId, socketId] of userSocketMap.entries()) {
                if (socketId === socket.id) {
                    userSocketMap.delete(userId);
                    break;
                }
            }
        });
    });

    return io;
};

// Helper function to send a real-time message to a specific user/driver ID
const sendMessageToUser = (io, userId, eventName, data) => {
    const socketId = userSocketMap.get(userId);
    if (socketId) {
        io.to(socketId).emit(eventName, data);
        return true;
    }
    return false;
};

module.exports = { initializeSocket, sendMessageToUser, userSocketMap };