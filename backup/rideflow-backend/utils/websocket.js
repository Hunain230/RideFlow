// utils/websocket.js
// WebSocket server for real-time ride updates

const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

class WebSocketServer {
  constructor() {
    this.wss = null;
    this.clients = new Map(); // userID -> WebSocket connection
  }

  initialize(server) {
    this.wss = new WebSocket.Server({ server });

    this.wss.on('connection', (ws, request) => {
      // Extract token from query string or headers
      const url = new URL(request.url, `http://${request.headers.host}`);
      const token = url.searchParams.get('token') || 
                   request.headers['sec-websocket-protocol'];

      if (!token) {
        ws.close(1008, 'Authentication required');
        return;
      }

      try {
        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userID = decoded.userID;
        const role = decoded.role;

        // Only allow riders to connect
        if (role !== 'Rider') {
          ws.close(1008, 'Rider access required');
          return;
        }

        // Store client connection
        this.clients.set(userID, ws);
        ws.userID = userID;
        ws.role = role;

        console.log(`WebSocket client connected: User ${userID} (${role})`);

        // Send welcome message
        this.sendToClient(userID, {
          type: 'connected',
          message: 'Connected to RideFlow real-time updates',
          timestamp: new Date()
        });

        // Handle incoming messages
        ws.on('message', (data) => {
          try {
            const message = JSON.parse(data);
            this.handleMessage(userID, message);
          } catch (err) {
            console.error('Invalid WebSocket message:', err);
          }
        });

        // Handle disconnection
        ws.on('close', () => {
          this.clients.delete(userID);
          console.log(`WebSocket client disconnected: User ${userID}`);
        });

        // Handle errors
        ws.on('error', (error) => {
          console.error(`WebSocket error for User ${userID}:`, error);
          this.clients.delete(userID);
        });

      } catch (err) {
        console.error('WebSocket authentication failed:', err);
        ws.close(1008, 'Invalid token');
      }
    });

    console.log('WebSocket server initialized');
  }

  handleMessage(userID, message) {
    switch (message.type) {
      case 'ping':
        this.sendToClient(userID, { type: 'pong', timestamp: new Date() });
        break;
      
      case 'subscribe_ride':
        // Subscribe to specific ride updates
        this.subscribeToRide(userID, message.rideID);
        break;
      
      default:
        console.log(`Unknown message type: ${message.type}`);
    }
  }

  subscribeToRide(userID, rideID) {
    // Verify ride belongs to this user
    db.query(
      'SELECT RideID FROM RIDES WHERE RideID = ? AND CustomerID = ?',
      [rideID, userID]
    ).then(([rows]) => {
      if (rows.length > 0) {
        const ws = this.clients.get(userID);
        if (ws) {
          ws.subscribedRide = rideID;
          this.sendToClient(userID, {
            type: 'subscribed',
            rideID: rideID,
            message: `Subscribed to ride ${rideID} updates`
          });
        }
      } else {
        this.sendToClient(userID, {
          type: 'error',
          message: 'Ride not found or access denied'
        });
      }
    }).catch(err => {
      console.error('Error subscribing to ride:', err);
    });
  }

  sendToClient(userID, data) {
    const ws = this.clients.get(userID);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }

  // Broadcast ride status update to specific rider
  broadcastRideUpdate(rideID, customerID, updateData) {
    const ws = this.clients.get(customerID);
    if (ws && ws.readyState === WebSocket.OPEN) {
      // Only send if client is subscribed to this ride or no specific subscription
      if (!ws.subscribedRide || ws.subscribedRide === rideID) {
        this.sendToClient(customerID, {
          type: 'ride_update',
          rideID: rideID,
          ...updateData,
          timestamp: new Date()
        });
      }
    }
  }

  // Broadcast notification to specific user
  broadcastNotification(userID, notification) {
    this.sendToClient(userID, {
      type: 'notification',
      notification: notification,
      timestamp: new Date()
    });
  }

  // Broadcast driver location update
  broadcastDriverLocation(rideID, customerID, location) {
    const ws = this.clients.get(customerID);
    if (ws && ws.readyState === WebSocket.OPEN && ws.subscribedRide === rideID) {
      this.sendToClient(customerID, {
        type: 'driver_location',
        rideID: rideID,
        location: location,
        timestamp: new Date()
      });
    }
  }

  // Get connected clients count
  getConnectedClients() {
    return this.clients.size;
  }

  // Check if user is connected
  isUserConnected(userID) {
    return this.clients.has(userID);
  }
}

// Create singleton instance
const wsServer = new WebSocketServer();

module.exports = wsServer;
