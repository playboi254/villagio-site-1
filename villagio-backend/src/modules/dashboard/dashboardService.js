const { User } = require('../../models/userDB')
const { Product } = require('../../models/productDB')
const { Order } = require('../../models/orderDB')
const { FarmerProfile } = require('../../models/farmerProfileDB')

exports.getAdminDashboardStats = async () => {
    const userStats = await User.aggregate([
        { $group: { _id: '$userType', count: { $sum: 1 } } }
    ])

    const totalUsersByRole = {}
    userStats.forEach(stat => {
        totalUsersByRole[stat._id] = stat.count
    })

    const totalFarmers = totalUsersByRole.farmer || 0
    const totalVendors = totalUsersByRole.vendor || 0
    const totalConsumers = totalUsersByRole.consumer || 0

    const totalProducts = await Product.countDocuments()
    const totalOrders = await Order.countDocuments()

    const revenueResult = await Order.aggregate([
        { $match: { paymentStatus: 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ])
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0

    const recentOrders = await Order.find()
        .populate('consumer', 'name')
        .sort({ createdAt: -1 })
        .limit(5)

    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const monthlyTrend = await Order.aggregate([
        { 
            $match: { 
                paymentStatus: 'completed',
                createdAt: { $gte: sixMonthsAgo }
            } 
        },
        {
            $group: {
                _id: { 
                    month: { $month: "$createdAt" },
                    year: { $year: "$createdAt" }
                },
                revenue: { $sum: "$totalAmount" },
                orders: { $sum: 1 }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
    ])

    return {
        totalUsersByRole,
        totalFarmers,
        totalVendors,
        totalConsumers,
        totalProducts,
        totalOrders,
        totalRevenue,
        recentOrders,
        monthlyTrend
    }
}

exports.getCategoryStatistics = async () => {
    return await Product.aggregate([
        {
            $group: {
                _id: "$category",
                count: { $sum: 1 },
                totalStock: { $sum: "$stock" }
            }
        }
    ])
}

exports.getTopSellingProductsStats = async () => {
    return await Order.aggregate([
        { $match: { paymentStatus: 'completed' } },
        { $unwind: "$items" },
        {
            $group: {
                _id: "$items.product",
                totalSold: { $sum: "$items.quantity" },
                revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
            }
        },
        { $sort: { totalSold: -1 } },
        { $limit: 5 },
        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "_id",
                as: "productDetails"
            }
        },
        { $unwind: "$productDetails" },
        {
            $project: {
                name: "$productDetails.name",
                totalSold: 1,
                revenue: 1
            }
        }
    ])
}

exports.getFarmerDashboardStats = async (farmerId) => {
    const profile = await FarmerProfile.findOne({ farmer: farmerId })
    const productCount = await Product.countDocuments({ farmer: farmerId })
    const farmerProducts = await Product.find({ farmer: farmerId }).distinct('_id')
    
    const orders = await Order.find({ 'items.product': { $in: farmerProducts } })
        .populate('consumer', 'name')
        .populate('items.product', 'name')
        .sort({ createdAt: -1 })

    const earningsResult = await Order.aggregate([
        { $match: { paymentStatus: 'completed', 'items.product': { $in: farmerProducts } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ])
    
    const totalEarnings = earningsResult.length > 0 ? earningsResult[0].total : 0
    const categories = profile ? profile.categoriesDealtWith : []

    return {
        profile,
        productCount,
        orders,
        totalEarnings,
        categories
    }
}

exports.getVendorDashboardStats = async (vendorId) => {
    const profile = await User.findById(vendorId).select('-password')
    const totalOrders = await Order.countDocuments({ consumer: vendorId })

    const spentResult = await Order.aggregate([
        { $match: { consumer: vendorId, paymentStatus: 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ])
    const totalSpent = spentResult.length > 0 ? spentResult[0].total : 0

    const statusBreakdown = await Order.aggregate([
        { $match: { consumer: vendorId } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
    ])

    const orderStatuses = {}
    statusBreakdown.forEach(stat => {
        orderStatuses[stat._id] = stat.count
    })

    const paymentMethods = await Order.aggregate([
        { $match: { consumer: vendorId } },
        { $group: { _id: '$paymentMethod', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ])

    return {
        profile,
        totalOrders,
        totalSpent,
        orderStatuses,
        preferredPaymentMethods: paymentMethods
    }
}

exports.getConsumerDashboardStats = async (consumerId) => {
    const totalOrders = await Order.countDocuments({ consumer: consumerId })

    const recentOrders = await Order.find({ consumer: consumerId })
        .populate('items.product', 'name category')
        .sort({ createdAt: -1 })
        .limit(10)

    const spentResult = await Order.aggregate([
        { $match: { consumer: consumerId, paymentStatus: 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ])
    const totalSpent = spentResult.length > 0 ? spentResult[0].total : 0

    const categoryStats = await Order.aggregate([
        { $match: { consumer: consumerId } },
        { $unwind: '$items' },
        { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'product' } },
        { $unwind: '$product' },
        { $group: { _id: '$product.category', count: { $sum: '$items.quantity' } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
    ])

    return {
        totalOrders,
        recentOrders,
        totalSpent,
        mostPurchasedCategories: categoryStats
    }
}
