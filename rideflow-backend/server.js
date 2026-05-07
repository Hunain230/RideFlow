// server.js — RideFlow REST API entry point
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const http    = require('http');
const { globalErrorHandler } = require('./utils/helpers');
const wsServer = require('./utils/websocket');

const app = express();
const server = http.createServer(app);

// ─── Middleware ───────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ─────────────────────────────────────────────
app.get('/health', (_req, res) =>
  res.json({ status: 'OK', app: 'RideFlow API', time: new Date().toISOString() })
);

// ─── Routes ───────────────────────────────────────────────────
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const customerRoutes = require('./routes/customer');
const driverRoutes = require('./routes/driver');
const riderRoutes = require('./routes/rider');
const notificationRoutes = require('./routes/notifications');

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/rider', riderRoutes);
app.use('/api/rider/notifications', notificationRoutes);

// ─── 404 Handler ──────────────────────────────────────────────
app.use((_req, res) =>
  res.status(404).json({ success: false, error: 'Route not found.' })
);

// ─── Global Error Handler ─────────────────────────────────────
app.use(globalErrorHandler);

// ─── Start ────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

// Initialize WebSocket server
wsServer.initialize(server);

server.listen(PORT, () => {
  console.log(`🚀  RideFlow API running on http://localhost:${PORT}`);
  console.log(`    WebSocket: ws://localhost:${PORT}`);
  console.log(`    ENV: ${process.env.NODE_ENV || 'development'}`);
  console.log(`    Connected WebSocket clients: ${wsServer.getConnectedClients()}`);
});
