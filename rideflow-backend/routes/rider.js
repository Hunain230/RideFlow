// routes/rider.js
const express = require('express');
const router = express.Router();
const { authenticate, requireRider } = require('../middleware/auth');
const C = require('../controllers/riderController');

// Apply authentication and role-based middleware to all routes
router.use(authenticate);
router.use(requireRider);

// All rider routes require JWT + Rider role
router.use(authenticate, requireRider);

// ─── Profile ──────────────────────────────────────────────────
router.get   ('/profile',                   C.getProfile);
router.patch ('/profile',                   C.updateProfile);
router.post  ('/phones',                    C.addPhone);
router.delete('/phones/:phone',             C.removePhone);

// ─── Browsing ─────────────────────────────────────────────────
router.get   ('/locations',                 C.getLocations);
router.get   ('/drivers/available',         C.getAvailableDrivers);
router.get   ('/vehicles',                  C.getVehicles);

// ─── Rides ────────────────────────────────────────────────────
router.post  ('/rides',                     C.requestRide);
router.get   ('/rides',                     C.getRideHistory);
router.get   ('/rides/:id',                 C.getRideDetail);
router.patch ('/rides/:id/cancel',          C.cancelRide);
router.post  ('/rides/:id/promo',           C.applyPromo);

// ─── Payments ─────────────────────────────────────────────────
router.post  ('/payments',                  C.makePayment);
router.get   ('/payments',                  C.getPaymentHistory);

// ─── Promo Codes ──────────────────────────────────────────────
router.get   ('/promocodes',                C.getActivePromoCodes);
router.get   ('/my-promocodes',             C.getMyPromoCodes);

// ─── Ratings ──────────────────────────────────────────────────
router.post  ('/ratings',                   C.rateDriver);

// ─── Complaints ───────────────────────────────────────────────
router.post  ('/complaints',                C.fileComplaint);
router.get   ('/complaints',                C.getMyComplaints);

// ─── Saved Locations ───────────────────────────────────────────
router.get   ('/saved-locations',           C.getSavedLocations);
router.post  ('/saved-locations',           C.addSavedLocation);
router.patch ('/saved-locations/:id',       C.updateSavedLocation);
router.delete('/saved-locations/:id',       C.deleteSavedLocation);

// ─── Safety Features ───────────────────────────────────────────
router.post  ('/sos',                       C.triggerSOS);
router.post  ('/share-trip',                C.shareTrip);
router.get   ('/emergency-contacts',        C.getEmergencyContacts);
router.post  ('/emergency-contacts',        C.addEmergencyContact);
router.delete('/emergency-contacts/:id',    C.deleteEmergencyContact);

module.exports = router;
