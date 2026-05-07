// routes/notifications.js
const express = require('express');
const router = express.Router();
const { authenticate, requireRider } = require('../middleware/auth');
const C = require('../controllers/notificationController');

// Apply authentication and role-based middleware to all routes
router.use(authenticate);
router.use(requireRider);

// ─── Notifications ───────────────────────────────────────────────
router.get   ('/',                    C.getNotifications);
router.post  ('/mark-read',            C.markNotificationsRead);
router.post  ('/mark-all-read',        C.markAllNotificationsRead);
router.delete('/:id',                  C.deleteNotification);

// ─── Safety Alerts ───────────────────────────────────────────────
router.get   ('/safety-alerts',        C.getSafetyAlerts);
router.post  ('/safety-alerts/:id/resolve', C.resolveSafetyAlert);

module.exports = router;
