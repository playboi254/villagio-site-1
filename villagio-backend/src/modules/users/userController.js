const path = require('path')
const multer = require('multer')
const userService = require('./userService')

// ─── Multer setup for avatar uploads ─────────────────────────────────────────
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-avatar${path.extname(file.originalname)}`),
})

const avatarUpload = multer({
  storage: avatarStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB as requested
  fileFilter: (req, file, cb) => {
    if (file.mimetype.match(/image\/(jpeg|jpg|png|webp)/)) {
      cb(null, true)
    } else {
      cb(new Error('Only JPG, PNG, or WebP images are allowed'))
    }
  },
}).single('avatar')

// ─── Get user profile ─────────────────────────────────────────────────────────
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserProfile(req.user.userId)
    res.status(200).json({
      success: true,
      message: 'User profile retrieved successfully',
      data: { user }
    })
  } catch (error) {
    next(error)
  }
}

// ─── Update user profile ──────────────────────────────────────────────────────
exports.updateUserProfile = async (req, res, next) => {
  try {
    const updatedUser = await userService.updateUserProfile(req.user.userId, req.body)
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: { user: updatedUser }
    })
  } catch (error) {
    next(error)
  }
}

// ─── Upload avatar ────────────────────────────────────────────────────────────
exports.uploadAvatar = (req, res, next) => {
  avatarUpload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ 
        success: false,
        message: err.message || 'Upload failed' 
      })
    }

    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'No file provided' 
      })
    }

    try {
      const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
      await userService.updateUserAvatar(req.user.userId, avatarUrl)
      res.status(200).json({
        success: true,
        message: 'Avatar uploaded successfully',
        data: { avatarUrl }
      })
    } catch (error) {
      next(error)
    }
  })
}

// ─── Get all users (Admin only) ───────────────────────────────────────────────
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers()
    res.status(200).json({
      success: true,
      message: 'All users retrieved successfully',
      data: { users }
    })
  } catch (error) {
    next(error)
  }
}

// ─── Delete user (Admin only) ─────────────────────────────────────────────────
exports.deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id)
    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: null
    })
  } catch (error) {
    next(error)
  }
}