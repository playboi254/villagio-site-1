const logisticsService = require('./logisticsService');

// Zones
exports.createZone = async (req, res, next) => {
    try {
        const zone = await logisticsService.createZone(req.body);
        res.status(201).json({
            success: true,
            message: 'Delivery zone created successfully',
            data: { zone }
        });
    } catch (error) {
        next(error);
    }
};

exports.getZones = async (req, res, next) => {
    try {
        const zones = await logisticsService.getAllZones();
        res.status(200).json({
            success: true,
            message: 'All delivery zones retrieved',
            data: { zones }
        });
    } catch (error) {
        next(error);
    }
};

// Drivers
exports.assignDriver = async (req, res, next) => {
    try {
        const { orderId, driverId } = req.body;
        const updatedOrder = await logisticsService.assignDriver(orderId, driverId);
        res.status(200).json({
            success: true,
            message: 'Driver assigned and order status updated',
            data: { order: updatedOrder }
        });
    } catch (error) {
        next(error);
    }
};

exports.getDrivers = async (req, res, next) => {
    try {
        const drivers = await logisticsService.getAvailableDrivers();
        res.status(200).json({
            success: true,
            message: 'Available drivers retrieved',
            data: { drivers }
        });
    } catch (error) {
        next(error);
    }
};

exports.getDashboardStats = async (req, res, next) => {
    try {
        const stats = await logisticsService.getLogisticsStats();
        res.status(200).json({
            success: true,
            message: 'Logistics dashboard stats retrieved',
            data: stats
        });
    } catch (error) {
        next(error);
    }
};

exports.getDeliveryEstimate = async (req, res, next) => {
    try {
        const estimate = await logisticsService.calculateDeliveryEstimate(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Delivery estimate retrieved',
            data: { estimate }
        });
    } catch (error) {
        next(error);
    }
};
