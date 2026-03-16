const orderService = require('./orderService')

exports.createOrder = async (req, res, next) => {
    try {
        const populatedOrder = await orderService.placeOrder(req.user.userId, req.body)
        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            data: { order: populatedOrder }
        })
    } catch (error) {
        next(error)
    }
}

exports.getUserOrders = async (req, res, next) => {
    try {
        const orders = await orderService.getUserOrders(req.user.userId)
        res.status(200).json({
            success: true,
            message: 'User orders retrieved successfully',
            data: { orders }
        })
    } catch (error) {
        next(error)
    }
}

exports.getAllOrders = async (req, res, next) => {
    try {
        const orders = await orderService.getAllOrders()
        res.status(200).json({
            success: true,
            message: 'All orders retrieved successfully',
            data: { orders }
        })
    } catch (error) {
        next(error)
    }
}

exports.getOrderById = async (req, res, next) => {
    try {
        const order = await orderService.getOrderById(req.params.id)
        res.status(200).json({
            success: true,
            message: 'Order retrieved successfully',
            data: { order }
        })
    } catch (error) {
        next(error)
    }
}

exports.updateOrderStatus = async (req, res, next) => {
    try {
        const updatedOrder = await orderService.updateOrderStatus(req.params.id, req.body.status, req.user.userId)
        res.status(200).json({
            success: true,
            message: `Order status updated to ${req.body.status}`,
            data: { order: updatedOrder }
        })
    } catch (error) {
        next(error)
    }
}

exports.cancelOrder = async (req, res, next) => {
    try {
        const updatedOrder = await orderService.cancelOrder(req.params.id, req.user.userId)
        res.status(200).json({
            success: true,
            message: 'Order cancelled successfully',
            data: { order: updatedOrder }
        })
    } catch (error) {
        next(error)
    }
}