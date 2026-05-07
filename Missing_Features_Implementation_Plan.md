# RideFlow Missing Features Implementation Plan

## 🚀 Critical Missing Features Implementation

### Phase 1: Real-time Ride Tracking (Priority: 🔴 Critical)

#### Backend Implementation
**File: `rideflow-backend/controllers/rideTrackingController.js`**
```javascript
// Real-time ride tracking with WebSocket support
const WebSocket = require('ws');
const geolib = require('geolib');

class RideTrackingController {
  constructor() {
    this.wss = new WebSocket.Server({ port: 8080 });
    this.activeDrivers = new Map(); // driverId -> location
    this.activeRides = new Map();   // rideId -> tracking data
  }

  // Update driver location
  updateDriverLocation(driverId, latitude, longitude) {
    this.activeDrivers.set(driverId, { lat: latitude, lng: longitude, timestamp: Date.now() });
    
    // Notify rider if driver is in active ride
    const ride = this.findActiveRideByDriver(driverId);
    if (ride) {
      this.broadcastToRider(ride.CustomerID, {
        type: 'driver_location',
        location: { latitude, longitude }
      });
    }
  }

  // Find nearest available driver
  findNearestDriver(pickupLat, pickupLng, vehicleType) {
    const availableDrivers = Array.from(this.activeDrivers.entries())
      .filter(([driverId, location]) => this.isDriverAvailable(driverId))
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
}
```

**File: `rideflow-backend/routes/rideTracking.js`**
```javascript
const express = require('express');
const router = express.Router();
const RideTracking = require('../controllers/rideTrackingController');

// POST /api/rides/:rideId/start-tracking
router.post('/:rideId/start-tracking', authMiddleware, async (req, res) => {
  // Initialize ride tracking
});

// POST /api/drivers/location
router.post('/location', authMiddleware, async (req, res) => {
  const { latitude, longitude } = req.body;
  rideTracking.updateDriverLocation(req.user.driverId, latitude, longitude);
  res.json({ success: true });
});

// GET /api/rides/:rideId/tracking
router.get('/:rideId/tracking', authMiddleware, async (req, res) => {
  // Get real-time ride data
});
```

#### Frontend Implementation
**File: `rideflow-frontend/src/components/RideTracker.tsx`**
```typescript
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';

interface Location {
  latitude: number;
  longitude: number;
}

export const RideTracker: React.FC<{ rideId: string }> = ({ rideId }) => {
  const [driverLocation, setDriverLocation] = useState<Location | null>(null);
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState<Location | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8080/ride/${rideId}`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'driver_location') {
        setDriverLocation(data.location);
      }
    };

    return () => ws.close();
  }, [rideId]);

  return (
    <MapContainer center={[driverLocation?.latitude || 0, driverLocation?.longitude || 0]} zoom={13}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {driverLocation && <Marker position={[driverLocation.latitude, driverLocation.longitude]} />}
      {pickupLocation && <Marker position={[pickupLocation.latitude, pickupLocation.longitude]} />}
      {dropoffLocation && <Marker position={[dropoffLocation.latitude, dropoffLocation.longitude]} />}
    </MapContainer>
  );
};
```

---

### Phase 2: Payment Gateway Integration (Priority: 🔴 Critical)

#### Backend Implementation
**File: `rideflow-backend/controllers/paymentController.js`**
```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class PaymentController {
  // Process credit card payment
  async processCreditCardPayment(req, res) {
    const { rideId, amount, paymentMethodId } = req.body;
    
    try {
      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Convert to cents
        currency: 'pkr',
        payment_method: paymentMethodId,
        confirmation_method: 'manual',
        confirm: true,
      });

      // Update payment record
      await db.query(
        'UPDATE PAYMENTS SET PaymentStatus = ?, TransactionID = ? WHERE RideID = ?',
        ['Paid', paymentIntent.id, rideId]
      );

      res.json({ success: true, paymentIntent });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Process wallet payment
  async processWalletPayment(req, res) {
    const { rideId, amount } = req.body;
    const userId = req.user.userID;

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Check wallet balance
      const [wallet] = await conn.query(
        'SELECT WalletBalance FROM DRIVERS WHERE UserID = ?',
        [userId]
      );

      if (wallet[0].WalletBalance < amount) {
        throw new Error('Insufficient wallet balance');
      }

      // Deduct from wallet
      await conn.query(
        'UPDATE DRIVERS SET WalletBalance = WalletBalance - ? WHERE UserID = ?',
        [amount, userId]
      );

      // Update payment record
      await conn.query(
        'UPDATE PAYMENTS SET PaymentStatus = ? WHERE RideID = ?',
        ['Paid', rideId]
      );

      await conn.commit();
      res.json({ success: true });
    } catch (error) {
      await conn.rollback();
      res.status(400).json({ error: error.message });
    } finally {
      conn.release();
    }
  }

  // Refund payment
  async refundPayment(req, res) {
    const { rideId, reason } = req.body;

    try {
      // Get payment details
      const [payment] = await db.query(
        'SELECT * FROM PAYMENTS WHERE RideID = ? AND PaymentStatus = ?',
        [rideId, 'Paid']
      );

      if (payment[0].PaymentMethod === 'CreditCard') {
        // Process Stripe refund
        const refund = await stripe.refunds.create({
          payment_intent: payment[0].TransactionID,
          reason: 'requested_by_customer'
        });
      }

      // Update payment status
      await db.query(
        'UPDATE PAYMENTS SET PaymentStatus = ? WHERE RideID = ?',
        ['Refunded', rideId]
      );

      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
```

#### Frontend Implementation
**File: `rideflow-frontend/src/components/PaymentForm.tsx`**
```typescript
import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface PaymentFormProps {
  rideId: string;
  amount: number;
  onPaymentSuccess: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ rideId, amount, onPaymentSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleCardPayment = async () => {
    if (!stripe || !elements) return;

    setIsProcessing(true);
    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement!,
    });

    if (error) {
      console.error(error);
      setIsProcessing(false);
      return;
    }

    try {
      const response = await fetch('/api/payments/credit-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rideId,
          amount,
          paymentMethodId: paymentMethod.id
        })
      });

      if (response.ok) {
        onPaymentSuccess();
      }
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWalletPayment = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/payments/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rideId, amount })
      });

      if (response.ok) {
        onPaymentSuccess();
      }
    } catch (error) {
      console.error('Wallet payment failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="payment-form">
      <div className="payment-methods">
        <button onClick={() => setPaymentMethod('card')} className={paymentMethod === 'card' ? 'active' : ''}>
          Credit Card
        </button>
        <button onClick={() => setPaymentMethod('wallet')} className={paymentMethod === 'wallet' ? 'active' : ''}>
          Wallet
        </button>
      </div>

      {paymentMethod === 'card' ? (
        <div className="card-payment">
          <CardElement />
          <button onClick={handleCardPayment} disabled={isProcessing}>
            {isProcessing ? 'Processing...' : `Pay PKR ${amount}`}
          </button>
        </div>
      ) : (
        <div className="wallet-payment">
          <p>Pay PKR {amount} from your wallet</p>
          <button onClick={handleWalletPayment} disabled={isProcessing}>
            {isProcessing ? 'Processing...' : 'Pay with Wallet'}
          </button>
        </div>
      )}
    </div>
  );
};
```

---

### Phase 3: Rating Interface (Priority: 🟡 High)

#### Backend Implementation
**File: `rideflow-backend/controllers/ratingController.js`**
```javascript
class RatingController {
  // Submit rating
  async submitRating(req, res) {
    const { rideId, ratedUserId, score, comment } = req.body;
    const ratedBy = req.user.userID;

    try {
      // Check if user can rate this ride
      const [ride] = await db.query(
        'SELECT * FROM RIDES WHERE RideID = ? AND (CustomerID = ? OR DriverID IN (SELECT DriverID FROM DRIVERS WHERE UserID = ?))',
        [rideId, ratedBy, ratedBy]
      );

      if (!ride[0]) {
        return res.status(403).json({ error: 'Cannot rate this ride' });
      }

      // Insert rating
      await db.query(
        'INSERT INTO RATINGS (RideID, RatedBy, RatedUserID, Score, Comment) VALUES (?, ?, ?, ?, ?)',
        [rideId, ratedBy, ratedUserId, score, comment]
      );

      res.json({ success: true, message: 'Rating submitted successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Get user ratings
  async getUserRatings(req, res) {
    const userId = req.params.userId || req.user.userID;

    const [ratings] = await db.query(
      `SELECT r.Score, r.Comment, r.Timestamp,
              CONCAT(u.FirstName, ' ', u.LastName) AS RatedByName,
              ri.RideID, ri.Fare
       FROM RATINGS r
       JOIN USERS u ON r.RatedBy = u.UserID
       JOIN RIDES ri ON r.RideID = ri.RideID
       WHERE r.RatedUserID = ?
       ORDER BY r.Timestamp DESC`,
      [userId]
    );

    // Calculate average rating
    const [avgResult] = await db.query(
      'SELECT AVG(Score) as AvgRating, COUNT(*) as TotalRatings FROM RATINGS WHERE RatedUserID = ?',
      [userId]
    );

    res.json({
      ratings,
      averageRating: avgResult[0].AvgRating,
      totalRatings: avgResult[0].TotalRatings
    });
  }

  // Get driver leaderboard
  async getDriverLeaderboard(req, res) {
    const { city } = req.query;

    let query = `
      SELECT 
        CONCAT(u.FirstName, ' ', u.LastName) AS DriverName,
        d.DriverID,
        AVG(r.Score) AS AvgRating,
        COUNT(r.Score) AS TotalRatings,
        COUNT(DISTINCT ri.RideID) AS TotalRides,
        l.City
      FROM DRIVERS d
      JOIN USERS u ON d.UserID = u.UserID
      JOIN RATINGS r ON r.RatedUserID = u.UserID
      JOIN RIDES ri ON ri.DriverID = d.DriverID AND ri.RideStatus = 'Completed'
      LEFT JOIN LOCATIONS l ON d.CurrentLocationID = l.LocationID
    `;

    const params = [];
    if (city) {
      query += ' WHERE l.City = ?';
      params.push(city);
    }

    query += ' GROUP BY d.DriverID ORDER BY AvgRating DESC, TotalRides DESC LIMIT 50';

    const [leaderboard] = await db.query(query, params);
    res.json(leaderboard);
  }
}
```

#### Frontend Implementation
**File: `rideflow-frontend/src/components/RatingModal.tsx`**
```typescript
import React, { useState } from 'react';

interface RatingModalProps {
  rideId: string;
  ratedUserId: string;
  ratedUserName: string;
  onSubmit: (rating: { score: number; comment: string }) => void;
  onClose: () => void;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  rideId,
  ratedUserId,
  ratedUserName,
  onSubmit,
  onClose
}) => {
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (score === 0) {
      alert('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rideId,
          ratedUserId,
          score,
          comment
        })
      });

      if (response.ok) {
        onSubmit({ score, comment });
        onClose();
      }
    } catch (error) {
      console.error('Failed to submit rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rating-modal">
      <div className="modal-content">
        <h3>Rate your experience with {ratedUserName}</h3>
        
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className={`star ${star <= score ? 'filled' : ''}`}
              onClick={() => setScore(star)}
            >
              ⭐
            </button>
          ))}
        </div>

        <textarea
          placeholder="Share your experience (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
        />

        <div className="modal-actions">
          <button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Rating'}
          </button>
        </div>
      </div>
    </div>
  );
};
```

---

### Phase 4: Driver Matching Algorithm (Priority: 🟡 High)

#### Backend Implementation
**File: `rideflow-backend/services/driverMatchingService.js`**
```javascript
const geolib = require('geolib');

class DriverMatchingService {
  async findBestDriver(pickupLocation, vehicleType, surgeMultiplier = 1.0) {
    // Get available drivers
    const [availableDrivers] = await db.query(`
      SELECT d.DriverID, d.UserID, d.CurrentLocationID,
             d.AvailabilityStatus, d.WalletBalance,
             l.Latitude, l.Longitude,
             v.VehicleType, v.VerificationStatus
      FROM DRIVERS d
      JOIN LOCATIONS l ON d.CurrentLocationID = l.LocationID
      JOIN VEHICLES v ON d.DriverID = v.DriverID
      WHERE d.AvailabilityStatus = 'Online'
        AND v.VerificationStatus = 'Verified'
        AND v.VehicleType = ?
    `, [vehicleType]);

    if (availableDrivers.length === 0) {
      return null;
    }

    // Calculate distance and score for each driver
    const scoredDrivers = availableDrivers.map(driver => {
      const distance = geolib.getDistance(
        { latitude: pickupLocation.latitude, longitude: pickupLocation.longitude },
        { latitude: driver.Latitude, longitude: driver.Longitude }
      );

      // Scoring factors
      const distanceScore = Math.max(0, 100 - distance / 100); // Lower distance = higher score
      const ratingScore = this.getDriverRatingScore(driver.DriverID);
      const earningsScore = Math.min(driver.WalletBalance / 100, 20); // Some preference for drivers with earnings
      const surgeBonus = surgeMultiplier > 1 ? 10 : 0; // Bonus during surge

      const totalScore = distanceScore + ratingScore + earningsScore + surgeBonus;

      return {
        ...driver,
        distance,
        score: totalScore
      };
    });

    // Sort by score (highest first) and distance (closest first as tiebreaker)
    scoredDrivers.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.distance - b.distance;
    });

    return scoredDrivers[0];
  }

  getDriverRatingScore(driverId) {
    // Get driver's average rating and convert to score
    // This would involve a database query to get average rating
    return 25; // Placeholder
  }

  async notifyDriver(driverId, rideDetails) {
    // Send notification to driver via WebSocket
    const notification = {
      type: 'ride_request',
      data: rideDetails
    };

    // This would integrate with your WebSocket system
    webSocketService.sendToDriver(driverId, notification);

    // Set timeout for driver response
    setTimeout(async () => {
      await this.handleDriverTimeout(driverId, rideDetails.rideId);
    }, 30000); // 30 second timeout
  }

  async handleDriverTimeout(driverId, rideId) {
    // Check if ride is still in 'Requested' status
    const [ride] = await db.query(
      'SELECT RideStatus FROM RIDES WHERE RideID = ?',
      [rideId]
    );

    if (ride[0] && ride[0].RideStatus === 'Requested') {
      // Try next available driver
      this.processRideRequest(rideId);
    }
  }

  async processRideRequest(rideId) {
    // Get ride details
    const [ride] = await db.query(`
      SELECT r.*, pl.Latitude as PickupLat, pl.Longitude as PickupLng,
             v.VehicleType, r.SurgeMultiplier
      FROM RIDES r
      JOIN LOCATIONS pl ON r.PickupLocationID = pl.LocationID
      JOIN VEHICLES v ON r.VehicleID = v.VehicleID
      WHERE r.RideID = ?
    `, [rideId]);

    if (ride.length === 0) return;

    const rideDetails = ride[0];
    const pickupLocation = {
      latitude: rideDetails.PickupLat,
      longitude: rideDetails.PickupLng
    };

    // Find best driver
    const bestDriver = await this.findBestDriver(
      pickupLocation,
      rideDetails.VehicleType,
      rideDetails.SurgeMultiplier
    );

    if (bestDriver) {
      // Update ride with assigned driver
      await db.query(
        'UPDATE RIDES SET DriverID = ?, RideStatus = ? WHERE RideID = ?',
        [bestDriver.DriverID, 'Accepted', rideId]
      );

      // Notify driver
      await this.notifyDriver(bestDriver.DriverId, rideDetails);
    } else {
      // No drivers available
      await db.query(
        'UPDATE RIDES SET RideStatus = ? WHERE RideID = ?',
        ['Cancelled', rideId]
      );
    }
  }
}
```

---

## 📋 Implementation Dependencies

### Required Package Installations
```bash
# Backend dependencies
npm install geolib stripe
npm install @types/geolib @types/stripe

# Frontend dependencies
npm install react-leaflet leaflet @stripe/react-stripe-js @stripe/stripe-js
npm install @types/leaflet
```

### Environment Variables
```env
# Payment Gateway
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# WebSocket
WEBSOCKET_PORT=8080

# Google Maps API (for location services)
GOOGLE_MAPS_API_KEY=...
```

### Database Updates
```sql
-- Add TransactionID to PAYMENTS table for stripe integration
ALTER TABLE PAYMENTS ADD COLUMN TransactionID VARCHAR(255);

-- Add indexes for performance
CREATE INDEX idx_drivers_location ON DRIVERS(CurrentLocationID);
CREATE INDEX idx_rides_status ON RIDES(RideStatus);
CREATE INDEX idx_ratings_user ON RATINGS(RatedUserID);
```

---

## 🚀 Implementation Timeline

### Week 1: Critical Features
- [ ] Real-time ride tracking backend
- [ ] WebSocket integration
- [ ] Basic payment gateway setup

### Week 2: User Experience
- [ ] Rating interface frontend
- [ ] Payment form integration
- [ ] Driver matching algorithm

### Week 3: Polish & Testing
- [ ] Error handling improvements
- [ ] Performance optimization
- [ ] User testing and feedback

### Week 4: Deployment Ready
- [ ] Security audit
- [ ] Documentation
- [ ] Production deployment

---

*This implementation plan addresses the most critical missing features to make RideFlow production-ready.*
