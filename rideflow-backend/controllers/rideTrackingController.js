const WebSocket = require('ws');
const geolib = require('geolib');
const db = require('../config/db');

class RideTrackingController {
  constructor() {
    this.wss = null;
    this.activeDrivers = new Map(); // driverId -> location
    this.activeRides = new Map();   // rideId -> tracking data
    this.driverSockets = new Map(); // driverId -> socket
    this.riderSockets = new Map();  // riderId -> socket
  }

  // Initialize WebSocket server
  initializeWebSocketServer() {
    if (this.wss) return this.wss;
    
    this.wss = new WebSocket.Server({ port: process.env.WEBSOCKET_PORT || 8080 });
    
    this.wss.on('connection', (ws, req) => {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const userId = url.searchParams.get('userId');
      const userType = url.searchParams.get('userType'); // 'driver' or 'rider'
      
      if (userId && userType) {
        if (userType === 'driver') {
          this.driverSockets.set(userId, ws);
        } else if (userType === 'rider') {
          this.riderSockets.set(userId, ws);
        }
        
        ws.on('close', () => {
          if (userType === 'driver') {
            this.driverSockets.delete(userId);
          } else if (userType === 'rider') {
            this.riderSockets.delete(userId);
          }
        });
      }
    });
    
    console.log(`WebSocket server initialized on port ${process.env.WEBSOCKET_PORT || 8080}`);
    return this.wss;
  }

  // Update driver location
  async updateDriverLocation(driverId, latitude, longitude) {
    this.activeDrivers.set(driverId, { 
      lat: latitude, 
      lng: longitude, 
      timestamp: Date.now() 
    });
    
    // Notify rider if driver is in active ride
    const ride = await this.findActiveRideByDriver(driverId);
    if (ride) {
      this.broadcastToRider(ride.CustomerID, {
        type: 'driver_location',
        location: { latitude, longitude },
        rideId: ride.RideID
      });
    }
  }

  // Find active ride for driver
  async findActiveRideByDriver(driverId) {
    const [rides] = await db.query(
      'SELECT * FROM RIDES WHERE DriverID = ? AND RideStatus IN ("Accepted", "In Progress")',
      [driverId]
    );
    return rides[0] || null;
  }

  // Find nearest available driver
  async findNearestDriver(pickupLat, pickupLng, vehicleType) {
    const availableDrivers = Array.from(this.activeDrivers.entries())
      .filter(([driverId, location]) => this.isDriverAvailable(driverId, vehicleType))
      .map(([driverId, location]) => ({
        driverId,
        distance: geolib.getDistance(
          { latitude: pickupLat, longitude: pickupLng },
          { latitude: location.lat, longitude: location.lng }
        )
      }))
      .sort((a, b) => a.distance - b.distance);

    return availableDrivers[0]?.driverId;
  }

  // Check if driver is available for specific vehicle type
  async isDriverAvailable(driverId, vehicleType) {
    const [drivers] = await db.query(`
      SELECT d.*, v.VehicleType 
      FROM DRIVERS d 
      JOIN VEHICLES v ON d.DriverID = v.DriverID 
      WHERE d.DriverID = ? AND d.AvailabilityStatus = 'Online' AND v.VehicleType = ?
    `, [driverId, vehicleType]);
    
    return drivers.length > 0;
  }

  // Broadcast message to rider
  broadcastToRider(riderId, message) {
    const riderSocket = this.riderSockets.get(riderId.toString());
    if (riderSocket && riderSocket.readyState === WebSocket.OPEN) {
      riderSocket.send(JSON.stringify(message));
    }
  }

  // Broadcast message to driver
  broadcastToDriver(driverId, message) {
    const driverSocket = this.driverSockets.get(driverId.toString());
    if (driverSocket && driverSocket.readyState === WebSocket.OPEN) {
      driverSocket.send(JSON.stringify(message));
    }
  }

  // Start ride tracking
  async startRideTracking(req, res) {
    const { rideId } = req.params;
    const userId = req.user.userID;

    try {
      // Verify user is part of this ride
      const [rides] = await db.query(
        'SELECT * FROM RIDES WHERE RideID = ? AND (CustomerID = ? OR DriverID IN (SELECT DriverID FROM DRIVERS WHERE UserID = ?))',
        [rideId, userId, userId]
      );

      if (rides.length === 0) {
        return res.status(403).json({ error: 'Unauthorized to track this ride' });
      }

      const ride = rides[0];
      
      // Initialize tracking data
      this.activeRides.set(rideId, {
        rideId,
        customerId: ride.CustomerID,
        driverId: ride.DriverID,
        startTime: Date.now(),
        status: 'tracking'
      });

      res.json({ success: true, message: 'Ride tracking started' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get ride tracking data
  async getRideTracking(req, res) {
    const { rideId } = req.params;
    const userId = req.user.userID;

    try {
      // Verify user is part of this ride
      const [rides] = await db.query(
        'SELECT * FROM RIDES WHERE RideID = ? AND (CustomerID = ? OR DriverID IN (SELECT DriverID FROM DRIVERS WHERE UserID = ?))',
        [rideId, userId, userId]
      );

      if (rides.length === 0) {
        return res.status(403).json({ error: 'Unauthorized to view this ride' });
      }

      const ride = rides[0];
      const trackingData = this.activeRides.get(rideId);
      const driverLocation = this.activeDrivers.get(ride.DriverId);

      // Get pickup and dropoff locations
      const [pickupLocation] = await db.query(
        'SELECT * FROM LOCATIONS WHERE LocationID = ?',
        [ride.PickupLocationID]
      );
      
      const [dropoffLocation] = await db.query(
        'SELECT * FROM LOCATIONS WHERE LocationID = ?',
        [ride.DropoffLocationID]
      );

      res.json({
        success: true,
        ride: {
          rideId: ride.RideID,
          status: ride.RideStatus,
          pickupLocation: pickupLocation[0],
          dropoffLocation: dropoffLocation[0]
        },
        driverLocation: driverLocation || null,
        trackingData: trackingData || null
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Update driver location endpoint
  async updateLocation(req, res) {
    const { latitude, longitude } = req.body;
    const userId = req.user.userID;

    try {
      // Get driver ID from user ID
      const [drivers] = await db.query(
        'SELECT DriverID FROM DRIVERS WHERE UserID = ?',
        [userId]
      );

      if (drivers.length === 0) {
        return res.status(404).json({ error: 'Driver not found' });
      }

      const driverId = drivers[0].DriverID;
      
      // Update driver location
      await this.updateDriverLocation(driverId, latitude, longitude);
      
      // Update database
      await db.query(
        'UPDATE LOCATIONS SET Latitude = ?, Longitude = ? WHERE LocationID = (SELECT CurrentLocationID FROM DRIVERS WHERE DriverID = ?)',
        [latitude, longitude, driverId]
      );

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Stop ride tracking
  async stopRideTracking(req, res) {
    const { rideId } = req.params;
    const userId = req.user.userID;

    try {
      // Verify user is part of this ride
      const [rides] = await db.query(
        'SELECT * FROM RIDES WHERE RideID = ? AND (CustomerID = ? OR DriverID IN (SELECT DriverID FROM DRIVERS WHERE UserID = ?))',
        [rideId, userId, userId]
      );

      if (rides.length === 0) {
        return res.status(403).json({ error: 'Unauthorized to stop tracking this ride' });
      }

      // Remove from active tracking
      this.activeRides.delete(rideId);

      res.json({ success: true, message: 'Ride tracking stopped' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

// Singleton instance
const rideTrackingController = new RideTrackingController();

// Initialize WebSocket server when module is loaded
rideTrackingController.initializeWebSocketServer();

module.exports = rideTrackingController;
