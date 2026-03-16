const { DeliveryZone } = require('../../models/logisticsDB');
const { Order } = require('../../models/orderDB');
const { User } = require('../../models/userDB');
const logger = require('../../utils/logger');

// ─── ZONE MANAGEMENT ─────────────────────────────────────────────────────────
exports.createZone = async (zoneData) => {
    const zone = new DeliveryZone(zoneData);
    return await zone.save();
};

exports.getAllZones = async () => {
    return await DeliveryZone.find().sort({ name: 1 });
};

exports.getZoneById = async (id) => {
    return await DeliveryZone.findById(id);
};

exports.updateZone = async (id, updateData) => {
    return await DeliveryZone.findByIdAndUpdate(id, updateData, { new: true });
};

exports.deleteZone = async (id) => {
    return await DeliveryZone.findByIdAndDelete(id);
};

// ─── DRIVER ASSIGNMENT ───────────────────────────────────────────────────────
exports.assignDriver = async (orderId, driverId) => {
    const order = await Order.findById(orderId);
    if (!order) {
        throw new Error('Order not found');
    }

    const driver = await User.findOne({ _id: driverId, userType: 'driver' });
    if (!driver) {
        throw new Error('Selected user is not a valid driver');
    }

    order.driver = driverId;
    order.status = 'out-for-delivery';
    return await order.save();
};

exports.getAvailableDrivers = async () => {
    return await User.find({ userType: 'driver' }).select('name email phone');
};

exports.getLogisticsStats = async () => {
    const [totalZones, activeDrivers, outForDelivery, pendingAssignment] = await Promise.all([
        DeliveryZone.countDocuments(),
        User.countDocuments({ userType: 'driver' }),
        Order.countDocuments({ status: 'out-for-delivery' }),
        Order.countDocuments({ status: 'confirmed', driver: null })
    ]);

    return {
        totalZones,
        activeDrivers,
        outForDelivery,
        pendingAssignment
    };
};

exports.calculateDeliveryEstimate = async (zoneId) => {
    const zone = await DeliveryZone.findById(zoneId);
    if (!zone) return "Scheduled Delivery";

    // Basic logic: 60 mins base + zone complexity
    // In a real app, this would use Google Maps Distance Matrix API
    const baseTime = 45; 
    const trafficDelay = 15;
    const zoneAdjustment = zone.deliveryFee > 300 ? 30 : 0; 

    const totalMinutes = baseTime + trafficDelay + zoneAdjustment;
    
    return `${totalMinutes} - ${totalMinutes + 20} mins`;
};
