const userService = require('./userService')

// ─── Save subscription ────────────────────────────────────────────────────────
exports.saveSubscription = async (req, res, next) => {
  try {
    await userService.savePushSubscription(req.user.userId, req.body.subscription)
    res.status(200).json({
      success: true,
      message: 'Subscription saved',
      data: null
    })
  } catch (error) {
    next(error)
  }
}

// ─── Delete subscription ──────────────────────────────────────────────────────
exports.deleteSubscription = async (req, res, next) => {
  try {
    await userService.deletePushSubscription(req.user.userId)
    res.status(200).json({
      success: true,
      message: 'Subscription removed',
      data: null
    })
  } catch (error) {
    next(error)
  }
}

// ─── Send push to one user (call this from orderController when status changes) ──
exports.sendPushToUser = async (userId, title, body, url = '/') => {
  // We just proxy this through to the service layer for other controllers utilizing this export
  return await userService.sendPushNotification(userId, title, body, url)
}

// ─── Send push to ALL users (e.g. promotions) ─────────────────────────────────
exports.broadcastPush = async (req, res, next) => {
  try {
    const { title, body, url } = req.body
    const stats = await userService.broadcastPushNotification(title, body, url)
    res.status(200).json({
      success: true,
      message: `Push notification broadcasted`,
      data: { stats }
    })
  } catch (error) {
    next(error)
  }
}