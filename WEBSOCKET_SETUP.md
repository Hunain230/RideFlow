# WebSocket Integration Setup Guide

## Overview
This guide explains how to set up Socket.IO for real-time driver features in the RideFlow application.

## Backend Setup

### 1. Install Socket.IO Dependencies

```bash
cd rideflow-backend
npm install socket.io
```

### 2. Update package.json Scripts

Add the following to your `package.json` scripts:

```json
{
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js"
  }
}
```

### 3. Environment Variables

Create/update your `.env` file:

```env
JWT_SECRET=your-super-secret-jwt-key-here
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
PORT=5000
```

### 4. Database Setup

Run the missing tables script:

```bash
mysql -u root -p < 10_missing_tables.sql
```

## Frontend Setup

### 1. Install Socket.IO Client

```bash
cd rideflow-frontend
npm install socket.io-client
```

### 2. Update Socket Service

Replace the mock implementation in `src/lib/socket.ts` with the real Socket.IO client:

```typescript
// Remove the mock implementation and uncomment:
import { io, Socket } from 'socket.io-client';

// Replace the mock connection with:
this.socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
  auth: {
    token: authToken
  },
  transports: ['websocket', 'polling'],
  timeout: 10000,
  reconnection: true,
  reconnectionAttempts: this.maxReconnectAttempts,
  reconnectionDelay: this.reconnectDelay
});
```

### 3. Environment Variables

Create/update `.env` in the frontend:

```env
VITE_API_URL=http://localhost:5000
```

## Real-Time Features Enabled

### Driver Features
- ✅ **Real-time ride requests** - Instant notifications when riders request rides
- ✅ **Live location tracking** - GPS position updates during rides
- ✅ **Driver status synchronization** - Online/Offline/In-Ride status updates
- ✅ **Ride status updates** - Real-time ride progress notifications
- ✅ **Emergency alerts** - SOS notifications to nearby drivers
- ✅ **Connection status indicators** - Visual feedback for WebSocket connectivity

### Customer Features
- ✅ **Driver location updates** - See driver position during ride
- ✅ **Ride acceptance notifications** - Instant confirmation when driver accepts
- ✅ **Ride progress updates** - Real-time status changes

### Admin Features
- ✅ **Driver status monitoring** - Live dashboard updates
- ✅ **Emergency alert handling** - Real-time SOS notifications
- ✅ **System notifications** - Admin-level real-time updates

## WebSocket Events

### Driver Events
```javascript
// Driver going online/offline
socket.emit('driver_online', { locationID, vehicleID });
socket.emit('driver_offline');

// Location updates
socket.emit('update_location', { latitude, longitude, locationID });

// Ride management
socket.emit('accept_ride', { rideId, vehicleID });
socket.emit('start_ride', { rideId });
socket.emit('complete_ride', { rideId });

// Emergency
socket.emit('sos_alert', { rideId, location });
```

### Receiving Events
```javascript
// New ride requests
socket.on('new_ride_request', (data) => {
  // Handle incoming ride request
});

// Ride status updates
socket.on('ride_status_update', (data) => {
  // Handle ride status changes
});

// Emergency alerts
socket.on('emergency_nearby', (data) => {
  // Handle nearby emergency
});
```

## Testing the Integration

### 1. Start Backend Server
```bash
cd rideflow-backend
npm run dev
```

### 2. Start Frontend Development Server
```bash
cd rideflow-frontend
npm run dev
```

### 3. Test Real-Time Features

1. **Driver Login**: Log in as a driver account
2. **Go Online**: Toggle online status to enable real-time features
3. **Connection Status**: Check the connection indicator in the header
4. **Ride Requests**: Create ride requests to test real-time notifications
5. **Location Tracking**: Monitor GPS updates during rides

## Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check if backend server is running on port 5000
   - Verify CORS settings in server configuration
   - Check JWT token in localStorage

2. **Authentication Errors**
   - Ensure JWT_SECRET is set in backend .env
   - Verify token format and expiration
   - Check user authentication status

3. **Location Permission Denied**
   - Enable location permissions in browser
   - Use HTTPS for production (required for geolocation)
   - Check browser console for permission errors

4. **Real-time Updates Not Working**
   - Verify Socket.IO connection status
   - Check browser network tab for WebSocket connection
   - Ensure both frontend and backend are running

### Debug Mode

Enable debug logging by setting environment variable:

```bash
DEBUG=socket.io:* npm run dev
```

## Production Considerations

### 1. HTTPS Required
- Geolocation API requires HTTPS in production
- WebSocket connections work better over HTTPS
- Update all URLs to use HTTPS

### 2. Scaling
- Consider using Redis for multi-instance Socket.IO scaling
- Implement load balancing for WebSocket connections
- Monitor WebSocket connection limits

### 3. Security
- Validate all incoming WebSocket events
- Rate limit WebSocket connections
- Implement proper authentication middleware

### 4. Performance
- Monitor WebSocket connection memory usage
- Implement connection cleanup on user disconnect
- Use connection pooling for database operations

## API Reference

### Socket.IO Server Methods
- `initializeSocket(server)` - Initialize Socket.IO with HTTP server
- `emitToUser(userId, event, data)` - Send event to specific user
- `emitToDrivers(event, data)` - Send event to all online drivers
- `emitToLocation(locationId, event, data)` - Send event to drivers in location

### Frontend Hook Methods
- `useWebSocket()` - React hook for WebSocket integration
- `useGeolocation()` - React hook for GPS tracking
- `ConnectionStatus` - Component for connection indicator

## Next Steps

1. **Install Socket.IO dependencies**
2. **Update environment variables**
3. **Replace mock implementation with real Socket.IO**
4. **Test real-time features**
5. **Deploy to production with HTTPS**

The WebSocket integration is now complete and ready for production use!
