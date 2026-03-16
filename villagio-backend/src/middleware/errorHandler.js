// ─── Enhanced Global Error Handler ───────────────────────────────────────────
const logger = require('../utils/logger')

const errorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500
  const isProduction = process.env.NODE_ENV === 'production'

  // Always log to Winston
  logger.error({
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  })

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message)
    return res.status(422).json({ 
      success: false,
      message: 'Validation failed', 
      errors: messages 
    })
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field'
    return res.status(409).json({ 
      success: false,
      message: `Duplicate value for ${field}` 
    })
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ 
      success: false,
      message: 'Invalid token' 
    })
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ 
      success: false,
      message: 'Token expired' 
    })
  }

  // Multer errors
  if (err.name === 'MulterError') {
    return res.status(400).json({ 
      success: false,
      message: err.message 
    })
  }

  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
    data: null,
    ...(isProduction ? {} : { stack: err.stack }),
  })
}

// Handle async route errors by wrapping handlers
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

module.exports = { errorHandler, asyncHandler }
