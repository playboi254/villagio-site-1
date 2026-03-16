const express = require('express')
const dashboardController = require('./dashboardController')
const { authMiddleware, roleMiddleware } = require('../../middleware/authMiddleware')

const router = express.Router()

router.get('/admin', authMiddleware, roleMiddleware(['admin']), dashboardController.getAdminDashboard)
router.get('/category-stats', authMiddleware, roleMiddleware(['admin']), dashboardController.getCategoryStats)
router.get('/top-products', authMiddleware, roleMiddleware(['admin']), dashboardController.getTopSellingProducts)
router.get('/farmer', authMiddleware, roleMiddleware(['farmer']), dashboardController.getFarmerDashboard)
router.get('/vendor', authMiddleware, roleMiddleware(['vendor']), dashboardController.getVendorDashboard)
router.get('/consumer', authMiddleware, roleMiddleware(['consumer']), dashboardController.getConsumerDashboard)

module.exports = router