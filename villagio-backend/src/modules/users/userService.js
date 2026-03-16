const { User } = require('../../models/userDB')
const webpush = require('web-push')

// web-push config can be initialized centrally or here
webpush.setVapidDetails(
  'mailto:' + process.env.VAPID_EMAIL,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
)

exports.getUserProfile = async (userId) => {
  const user = await User.findById(userId).select('-password')
  if (!user) {
    const error = new Error('User not found')
    error.status = 404
    throw error
  }
  return user
}

exports.updateUserProfile = async (userId, { name, phone, address }) => {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { name, phone, address },
    { new: true }
  ).select('-password')

  if (!updatedUser) {
    const error = new Error('User not found')
    error.status = 404
    throw error
  }
  return updatedUser
}

exports.updateUserAvatar = async (userId, avatarUrl) => {
  return await User.findByIdAndUpdate(userId, { avatar: avatarUrl })
}

exports.getAllUsers = async () => {
  return await User.find().select('-password')
}

exports.deleteUser = async (userId) => {
  const deletedUser = await User.findByIdAndDelete(userId)
  if (!deletedUser) {
    const error = new Error('User not found')
    error.status = 404
    throw error
  }
  return deletedUser
}

exports.savePushSubscription = async (userId, subscription) => {
  return await User.findByIdAndUpdate(userId, { pushSubscription: subscription })
}

exports.deletePushSubscription = async (userId) => {
  return await User.findByIdAndUpdate(userId, { pushSubscription: null })
}

exports.sendPushNotification = async (userId, title, body, url = '/') => {
  try {
    const user = await User.findById(userId)
    if (!user?.pushSubscription) return

    await webpush.sendNotification(
      user.pushSubscription,
      JSON.stringify({ title, body, url, icon: '/icons/icon-192x192.png' })
    )
  } catch (error) {
    if (error.statusCode === 410) {
      await User.findByIdAndUpdate(userId, { pushSubscription: null })
    }
    console.error('Push failed:', error.message)
  }
}

exports.broadcastPushNotification = async (title, body, url) => {
  const users = await User.find({ pushSubscription: { $ne: null } })

  const results = await Promise.allSettled(
    users.map(user =>
      webpush.sendNotification(
        user.pushSubscription,
        JSON.stringify({ title, body, url: url || '/', icon: '/icons/icon-192x192.png' })
      )
    )
  )

  const sent = results.filter(r => r.status === 'fulfilled').length
  return { sent, total: users.length }
}
