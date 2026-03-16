const notificationService = require('./notificationService')

// Get user notifications
exports.getUserNotifications = async (req, res, next) => {
    try {
        const notifications = await notificationService.fetchUserNotifications(req.user.userId)
        res.status(200).json({
            success: true,
            message: 'Notifications retrieved successfully',
            data: { notifications }
        })
    } catch (error) {
        next(error)
    }
}

// Mark notification as read
exports.markAsRead = async (req, res, next) => {
    try {
        const notification = await notificationService.markNotificationAsRead(req.params.id)
        res.status(200).json({
            success: true,
            message: 'Notification marked as read',
            data: { notification }
        })
    } catch (error) {
        next(error)
    }
}

// Delete notification
exports.deleteNotification = async (req, res, next) => {
    try {
        await notificationService.removeNotification(req.params.id)
        res.status(200).json({
            success: true,
            message: 'Notification deleted successfully',
            data: null
        })
    } catch (error) {
        next(error)
    }
}

// Create notification (internal logic)
exports.createNotification = async (userId, title, message, type) => {
    try {
        await notificationService.createOneNotification(userId, title, message, type)
    } catch (error) {
        console.error('Error creating notification:', error.message)
    }
}
