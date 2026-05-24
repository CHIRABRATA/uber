const http = require('http');
const app = require('./app');
const { initializeSocket } = require('./socket'); // Import our setup function

const port = process.env.PORT || 3000;

// 1. Create a native HTTP instance wrapping your Express app configuration
const server = http.createServer(app);

// 2. Pass that HTTP server instance over to initialize Socket.io
const io = initializeSocket(server);

// 3. Make Express accessible to the 'io' instance globally across controllers
app.set('io', io);

// 4. IMPORTANT: Change 'app.listen' to 'server.listen'!
server.listen(port, () => {
    console.log(`Server is running securely on port ${port}`);
});