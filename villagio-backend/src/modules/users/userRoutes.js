const express = require('express')
const userController = require('./userController')
const pushController = require('./pushController')
const { authMiddleware, roleMiddleware } = require('../../middleware/authMiddleware')

const router = express.Router()

router.get('/profile/:id', authMiddleware, userController.getUserProfile)
router.put('/profile', authMiddleware, userController.updateUserProfile)
router.patch('/profile/avatar', authMiddleware, userController.uploadAvatar)

// ✅ Push notification subscriptions (PWA)
router.post('/push-subscription', authMiddleware, pushController.saveSubscription)
router.delete('/push-subscription', authMiddleware, pushController.deleteSubscription)

router.get('/', authMiddleware, roleMiddleware(['admin']), userController.getAllUsers)
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), userController.deleteUser)

module.exports = router