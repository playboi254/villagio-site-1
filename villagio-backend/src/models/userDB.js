const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  userType: {
    type: String,
    enum: ['admin', 'vendor', 'farmer', 'customer', 'driver'],
    required: true,
  },
  phone: { type: String, default: null },
  address: { type: String, default: null },
  avatar: { type: String, default: null },
  isVerified: { type: Boolean, default: false },
  pushSubscription: { type: Object, default: null },
}, { timestamps: true })

// ─── Indexes ──────────────────────────────────────────────────────────────────
userSchema.index({ email: 1 })      // already unique, but explicit for clarity
userSchema.index({ userType: 1 })
userSchema.index({ createdAt: -1 })

module.exports = {
  User: mongoose.model('User', userSchema),
}