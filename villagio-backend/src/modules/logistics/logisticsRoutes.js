const express = require('express');
const router = express.Router();
const logisticsController = require('./logisticsController');
const { authMiddleware, roleMiddleware } = require('../../middleware/authMiddleware');

// ─── ADMIN ROUTES ───────────────────────────────────────────────────────────
router.post('/zones', authMiddleware, roleMiddleware(['admin']), logisticsController.createZone);
router.get('/zones', authMiddleware, logisticsController.getZones);
router.get('/zones/:id/estimate', authMiddleware, logisticsController.getDeliveryEstimate);

router.post('/assign-driver', authMiddleware, roleMiddleware(['admin']), logisticsController.assignDriver);
router.get('/drivers', authMiddleware, roleMiddleware(['admin']), logisticsController.getDrivers);
router.get('/dashboard', authMiddleware, roleMiddleware(['admin']), logisticsController.getDashboardStats);

module.exports = router;
