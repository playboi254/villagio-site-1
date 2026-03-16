const dashboardService = require('./dashboardService')

// Admin Dashboard
exports.getAdminDashboard = async (req, res, next) => {
    try {
        const stats = await dashboardService.getAdminDashboardStats()
        res.status(200).json({
            success: true,
            message: 'Admin dashboard statistics retrieved',
            data: stats
        })
    } catch (error) {
        next(error)
    }
}

// Stats by Category
exports.getCategoryStats = async (req, res, next) => {
    try {
        const stats = await dashboardService.getCategoryStatistics()
        res.status(200).json({
            success: true,
            message: 'Category statistics retrieved',
            data: stats
        })
    } catch (error) {
        next(error)
    }
}

// Top Selling Products
exports.getTopSellingProducts = async (req, res, next) => {
    try {
        const topProducts = await dashboardService.getTopSellingProductsStats()
        res.status(200).json({
            success: true,
            message: 'Top selling products retrieved',
            data: { products: topProducts }
        })
    } catch (error) {
        next(error)
    }
}

// Farmer Dashboard
exports.getFarmerDashboard = async (req, res, next) => {
    try {
        const stats = await dashboardService.getFarmerDashboardStats(req.user.userId)
        res.status(200).json({
            success: true,
            message: 'Farmer dashboard statistics retrieved',
            data: stats
        })
    } catch (error) {
        next(error)
    }
}

// Vendor Dashboard
exports.getVendorDashboard = async (req, res, next) => {
    try {
        const stats = await dashboardService.getVendorDashboardStats(req.user.userId)
        res.status(200).json({
            success: true,
            message: 'Vendor dashboard statistics retrieved',
            data: stats
        })
    } catch (error) {
        next(error)
    }
}

// Consumer Dashboard
exports.getConsumerDashboard = async (req, res, next) => {
    try {
        const stats = await dashboardService.getConsumerDashboardStats(req.user.userId)
        res.status(200).json({
            success: true,
            message: 'Consumer dashboard statistics retrieved',
            data: stats
        })
    } catch (error) {
        next(error)
    }
}