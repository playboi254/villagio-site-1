const { Notification } = require('../../models/notificationDB')

exports.fetchUserNotifications = async (userId) => {
    return await Notification.find({ user: userId })
        .sort({ createdAt: -1 })
}

exports.markNotificationAsRead = async (notificationId) => {
    const notification = await Notification.findByIdAndUpdate(
        notificationId,
        { isRead: true },
        { new: true }
    )
    if (!notification) {
        const error = new Error('Notification not found')
        error.status = 404
        throw error
    }
    return notification
}

exports.removeNotification = async (notificationId) => {
    const notification = await Notification.findByIdAndDelete(notificationId)
    if (!notification) {
        const error = new Error('Notification not found')
        error.status = 404
        throw error
    }
    return notification
}

exports.createOneNotification = async (userId, title, message, type) => {
    const newNotification = new Notification({
        user: userId,
        title,
        message,
        type
    })
    return await newNotification.save()
}
