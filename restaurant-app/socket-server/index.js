const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

// --- PRODUCTION: Replace this with your Vercel app's URL ---
// You will get this URL in Step 3
const VERCEL_APP_URL = process.env.VERCEL_URL || "http://localhost:3000";

const app = express();

// Set up CORS
const corsOptions = {
  origin: [VERCEL_APP_URL, "http://localhost:3000"], // Allow dev and prod
  methods: ["GET", "POST"]
};
app.use(cors(corsOptions));

const server = http.createServer(app);

const io = new Server(server, {
  cors: corsOptions
});

app.get('/', (req, res) => {
  res.send('Socket.io server is running.');
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Listen for an order status update from the admin panel
  socket.on('order:status-update', (data) => {
    // Broadcast this update to the specific customer
    console.log('Broadcasting order update:', data);
    io.emit(`order:${data.orderId}`, data.status); //
  });

  // Listen for a new order from the checkout
  socket.on('order:new', (orderData) => {
    // Broadcast this to all connected admins
    console.log('Broadcasting new order:', orderData);
    io.emit('order:new-for-admin', orderData);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket.io server listening on *:${PORT}`);
});
