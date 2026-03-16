const authService = require('./authService')

exports.register = async (req, res, next) => {
  try {
    const result = await authService.registerUser(req.body)
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

exports.login = async (req, res, next) => {
  try {
    const result = await authService.loginUser(req.body)
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result
    })
  } catch (error) {
    next(error)
  }
}

exports.getProfile = async (req, res, next) => {
  try {
    const user = await authService.getUserProfile(req.user.userId)
    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: { user }
    })
  } catch (error) {
    next(error)
  }
}

exports.updateProfile = async (req, res, next) => {
  try {
    const avatarPath = req.file ? `uploads/${req.file.filename}` : null
    const updateData = { ...req.body, avatarPath }
    const user = await authService.updateUserProfile(req.user.userId, updateData, req.file && !req.file.filename.includes('avatar') ? req.file : null)
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    })
  } catch (error) {
    next(error)
  }
}