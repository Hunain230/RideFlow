const express = require('express');
const router = express.Router();
const rideTrackingController = require('../controllers/rideTrackingController');
const auth = require('../middleware/auth');

// POST /api/rides/:rideId/start-tracking
router.post('/:rideId/start-tracking', auth, async (req, res) => {
  await rideTrackingController.startRideTracking(req, res);
});

// GET /api/rides/:rideId/tracking
router.get('/:rideId/tracking', auth, async (req, res) => {
  await rideTrackingController.getRideTracking(req, res);
});

// POST /api/drivers/location
router.post('/location', auth, async (req, res) => {
  await rideTrackingController.updateLocation(req, res);
});

// POST /api/rides/:rideId/stop-tracking
router.post('/:rideId/stop-tracking', auth, async (req, res) => {
  await rideTrackingController.stopRideTracking(req, res);
});

module.exports = router;
