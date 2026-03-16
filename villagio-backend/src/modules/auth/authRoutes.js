const express = require('express')
const authController = require('./authController')
const { authMiddleware } = require('../../middleware/authMiddleware')
const { upload, handleMulterError } = require('../../middleware/uploadMiddleware')
const { validate } = require('../../middleware/validateMiddleware')
const { registerSchema, loginSchema, updateProfileSchema } = require('../../utils/schemas')

const router = express.Router()

router.post('/register', validate(registerSchema), authController.register)
router.post('/login',    validate(loginSchema), authController.login)
router.get('/profile',   authMiddleware, authController.getProfile)
router.put('/profile',   authMiddleware, upload.single('avatar'), handleMulterError, authController.updateProfile)

module.exports = router