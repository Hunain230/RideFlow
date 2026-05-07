// routes/analytics.js
const router = require('express').Router();
const { authenticate, requireDriver } = require('../middleware/auth');
const C = require('../controllers/analyticsController');

// All analytics routes require JWT + Driver role
router.use(authenticate, requireDriver);

// ─── Earnings Analytics ───────────────────────────────────────
router.get('/earnings/overview', C.getEarningsOverview);
router.get('/earnings/daily', C.getDailyEarnings);
router.get('/earnings/weekly', C.getWeeklyEarnings);
router.get('/earnings/monthly', C.getMonthlyEarnings);

// ─── Performance Analytics ───────────────────────────────────
router.get('/performance/metrics', C.getPerformanceMetrics);
router.get('/performance/trends', C.getPerformanceTrends);

// ─── Location Analytics ───────────────────────────────────────
router.get('/locations/hotspots', C.getLocationHotspots);
router.get('/locations/routes', C.getPopularRoutes);

// ─── Time Analytics ───────────────────────────────────────────
router.get('/time/peak-hours', C.getPeakHours);
router.get('/time/peak-days', C.getPeakDays);

// ─── Forecasting ─────────────────────────────────────────────
router.get('/forecast/earnings', C.getEarningsForecast);

// ─── Export Analytics ─────────────────────────────────────────
router.get('/export/:type', C.exportAnalytics);

module.exports = router;
