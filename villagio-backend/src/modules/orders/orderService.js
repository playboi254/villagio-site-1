const { Order } = require('../../models/orderDB')
const { Product } = require('../../models/productDB')
const { sendPushToUser } = require('../users/pushController')
const logger = require('../../utils/logger')

exports.placeOrder = async (consumerId, orderData) => {
    const session = await Order.startSession()
    try {
        session.startTransaction()

        const { items, deliveryAddress, paymentMethod } = orderData

        if (!items || items.length === 0) {
            const err = new Error('Order must contain at least one item')
            err.status = 400
            throw err
        }

        const firstProduct = await Product.findById(items[0].productId)
            .populate('farmer', 'name')
            .session(session)

        if (!firstProduct) {
            const err = new Error('Invalid product')
            err.status = 400
            throw err
        }

        const vendor = firstProduct.farmer
        const vendorNameParts = vendor.name.split(' ')
        const vendorFirstName = vendorNameParts[0] || ''
        const vendorLastName = vendorNameParts.slice(1).join(' ') || ''

        let totalAmount = 0
        const orderItems = []

        // ─── Atomic inventory deduction (prevents overselling) ──────────────
        for (const item of items) {
            const product = await Product.findOneAndUpdate(
                {
                    _id: item.productId,
                    quantity: { $gte: item.quantity },
                    isAvailable: true,
                },
                { $inc: { quantity: -item.quantity } },
                { new: true, session }
            )

            if (!product) {
                const err = new Error(`Insufficient stock for product ID ${item.productId}. Please adjust your cart.`)
                err.status = 409
                throw err
            }

            totalAmount += item.price * item.quantity
            orderItems.push({
                product: item.productId,
                quantity: item.quantity,
                price: item.price,
            })
        }

        const [newOrder] = await Order.create([{
            consumer: consumerId,
            vendorFirstName,
            vendorLastName,
            items: orderItems,
            totalAmount,
            deliveryAddress,
            paymentMethod,
            status: 'pending',
        }], { session })

        await session.commitTransaction()

        const populated = await newOrder.populate('consumer', 'name email phone')

        // ─── Push notification ───────────────────────────────────────────────
        try {
            await sendPushToUser(
                consumerId,
                '🛒 Order Placed!',
                `Your order of KSh ${totalAmount.toLocaleString()} has been received.`,
                `/order-tracking/${newOrder._id}`
            )
        } catch (notifErr) {
            logger.warn(`Push notification failed: ${notifErr.message}`)
        }

        logger.info(`Order created: ${newOrder._id} by user ${consumerId}`)
        return populated
    } catch (error) {
        await session.abortTransaction()
        throw error
    } finally {
        session.endSession()
    }
}

exports.getUserOrders = async (consumerId) => {
    return await Order.find({ consumer: consumerId })
        .populate('items.product', 'name price images')
        .sort({ createdAt: -1 })
}

exports.getAllOrders = async () => {
    return await Order.find()
        .populate('consumer', 'name email phone')
        .populate('items.product', 'name price')
        .sort({ createdAt: -1 })
}

exports.getOrderById = async (orderId) => {
    const order = await Order.findById(orderId)
        .populate('consumer', 'name email phone')
        .populate('items.product', 'name price images')

    if (!order) {
        const err = new Error('Order not found')
        err.status = 404
        throw err
    }
    return order
}

exports.updateOrderStatus = async (orderId, status, executiveId) => {
    const validStatuses = ['pending', 'confirmed', 'packing', 'out-for-delivery', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) {
        const err = new Error('Invalid order status')
        err.status = 400
        throw err
    }

    const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
    )
        .populate('consumer', 'name email phone')
        .populate('items.product', 'name price')

    if (!updatedOrder) {
        const err = new Error('Order not found')
        err.status = 404
        throw err
    }

    const statusMessages = {
        confirmed:         { title: '✅ Order Confirmed',        body: 'Your order is being prepared.' },
        packing:           { title: '📦 Order Being Packed',     body: 'Your order is being packed for delivery.' },
        'out-for-delivery': { title: '🚚 Out for Delivery',       body: 'Your order is on its way!' },
        delivered:         { title: '🎉 Order Delivered',         body: 'Your order has been delivered. Enjoy!' },
        cancelled:         { title: '❌ Order Cancelled',         body: 'Your order has been cancelled.' },
        pending:           { title: '⏳ Order Pending',           body: 'Your order is pending confirmation.' },
    }

    const msg = statusMessages[status]
    if (msg) {
        try {
            await sendPushToUser(
                updatedOrder.consumer._id,
                msg.title,
                msg.body,
                `/order-tracking/${updatedOrder._id}`
            )

            const customerPhone = updatedOrder.consumer.phone
            if (customerPhone) {
                const waMessage = encodeURIComponent(`${msg.title}\n\n${msg.body}\n\nView Order: https://villagio.co.ke/order-tracking/${updatedOrder._id}`)
                logger.info(`[WHATSAPP] wa.me/${customerPhone}?text=${waMessage}`)
            }
        } catch (notifErr) {
            logger.warn(`Notification failed for order ${orderId}: ${notifErr.message}`)
        }
    }

    logger.info(`Order ${orderId} status → ${status} by user ${executiveId}`)
    return updatedOrder
}

exports.cancelOrder = async (orderId, consumerId) => {
    const order = await Order.findById(orderId).populate('consumer', 'name email phone')

    if (!order) {
        const err = new Error('Order not found')
        err.status = 404
        throw err
    }

    if (order.status !== 'pending') {
        const err = new Error('Only pending orders can be cancelled')
        err.status = 400
        throw err
    }

    order.status = 'cancelled'
    const updatedOrder = await order.save()

    try {
        await sendPushToUser(
            order.consumer._id,
            '❌ Order Cancelled',
            'Your order has been cancelled.',
            `/order-tracking/${order._id}`
        )
    } catch (notifErr) {
        logger.warn(`Push notification failed: ${notifErr.message}`)
    }

    logger.info(`Order ${order._id} cancelled by user ${consumerId}`)
    return updatedOrder
}
