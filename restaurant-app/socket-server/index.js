const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors()); // Allow all origins

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Allow your Vercel app URL
    methods: ["GET", "POST"]
  }
});

app.get('/', (req, res) => {
  res.send('Socket.io server is running.');
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Listen for an order status update from the admin panel
  socket.on('order:status-update', (data) => {
    // Broadcast this update to the specific customer
    // We can make the customer join a "room" named after their order
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