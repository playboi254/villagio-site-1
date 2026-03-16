const { User } = require('../../models/userDB')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const securityConfig = require('../../config/security')
const fs = require('fs')
const path = require('path')

const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email, userType: user.userType },
    securityConfig.jwt.secret,
    { expiresIn: securityConfig.jwt.expiresIn }
  )
}

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  userType: user.userType,
  phone: user.phone || null,
  avatar: user.avatar || null,
})

exports.registerUser = async ({ email, password, name, userType }) => {
  const existingUser = await User.findOne({ email })
  if (existingUser) {
    const error = new Error('User already exists')
    error.status = 409
    throw error
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const savedUser = await new User({
    email,
    password: hashedPassword,
    name,
    userType,
  }).save()

  return {
    user: formatUser(savedUser),
    token: generateToken(savedUser),
  }
}

exports.loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email })
  if (!user) {
    const error = new Error('Invalid credentials')
    error.status = 401
    throw error
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    const error = new Error('Invalid credentials')
    error.status = 401
    throw error
  }

  return {
    user: formatUser(user),
    token: generateToken(user),
  }
}

exports.getUserProfile = async (userId) => {
  const user = await User.findById(userId).select('-password')
  if (!user) {
    const error = new Error('User not found')
    error.status = 404
    throw error
  }
  return formatUser(user)
}

exports.updateUserProfile = async (userId, updateData, file) => {
  const user = await User.findById(userId)
  if (!user) {
    const error = new Error('User not found')
    error.status = 404
    throw error
  }

  if (updateData.name) user.name = updateData.name
  if (updateData.phone) user.phone = updateData.phone
  if (updateData.email) user.email = updateData.email

  if (file) {
    // If the file comes from multer without a proper normalized path, we handle it
    const ext = path.extname(file.originalname)
    const newFileName = 'avatar-' + user._id + '-' + Date.now() + ext
    const newPath = path.join('uploads', newFileName)
    fs.renameSync(file.path, newPath)
    user.avatar = newPath.replace(/\\/g, '/')
  } else if (updateData.avatarPath) {
     // If the secure upload middleware already moved it to /uploads/UUID
     user.avatar = updateData.avatarPath
  }

  if (updateData.currentPassword && updateData.newPassword) {
    const isMatch = await bcrypt.compare(updateData.currentPassword, user.password)
    if (!isMatch) {
      const error = new Error('Incorrect current password')
      error.status = 401
      throw error
    }
    user.password = await bcrypt.hash(updateData.newPassword, 10)
  }

  const updatedUser = await user.save()
  return formatUser(updatedUser)
}
