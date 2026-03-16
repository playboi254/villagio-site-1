const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const compression = require('compression')

// Import Central Configuration
const config = require('./src/config/index')
const logger = require('./src/utils/logger')

const app = express()

// ─── SECURITY HEADERS ─────────────────────────────────────────────────────────
app.use(helmet())
app.use(compression())

// ─── CORS ─────────────────────────────────────────────────────────────────────
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || config.server.allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(null, false)
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors(corsOptions))
app.options('*', cors(corsOptions))

// ─── RATE LIMITING ────────────────────────────────────────────────────────────
const { globalLimiter } = require('./src/middleware/rateLimiter')
app.use(globalLimiter)

// ─── BODY PARSING ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// ─── NOSQL INJECTION SANITIZATION ─────────────────────────────────────────────
app.use(mongoSanitize({ replaceWith: '_' }))

// ─── XSS PROTECTION ───────────────────────────────────────────────────────────
const xss = require('xss-clean')
app.use(xss())

// ─── STATIC FILES ─────────────────────────────────────────────────────────────
app.use('/uploads', express.static('uploads'))

// ─── REQUEST LOGGING ──────────────────────────────────────────────────────────
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl} – ${req.ip}`)
  next()
})

// ─── DATABASE ─────────────────────────────────────────────────────────────────
const connectDB = async () => {
  try {
    await mongoose.connect(config.database.uri, config.database.options)
    logger.info('✅ MongoDB connected')
  } catch (error) {
    logger.error(`❌ MongoDB connection failed: ${error.message}`)
    process.exit(1)
  }
}

// ─── ROUTES (API VERSIONING v1) ───────────────────────────────────────────────
const mountRoutes = (app) => {
  const { authLimiter } = require('./src/middleware/rateLimiter')

  // API Version 1 prefix
  const v1 = express.Router()

  v1.use('/auth',          authLimiter, require('./src/modules/auth/authRoutes'))
  v1.use('/users',         require('./src/modules/users/userRoutes'))
  v1.use('/products',      require('./src/modules/products/productRoutes'))
  v1.use('/orders',        require('./src/modules/orders/orderRoutes'))
  v1.use('/notifications', require('./src/modules/notifications/notificationRoutes'))
  v1.use('/farmers',       require('./src/modules/farmers/farmerProfileRoutes'))
  v1.use('/dashboard',     require('./src/modules/dashboard/dashboardRoutes'))
  v1.use('/promotions',    require('./src/modules/promotions/promotionRoutes'))
  v1.use('/payments',      require('./src/modules/payments/paymentRoutes'))
  v1.use('/logistics',     require('./src/modules/logistics/logisticsRoutes'))

  // Mount v1 router at /api/v1
  app.use('/api/v1', v1)
}

// ─── HEALTH CHECK ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    version: 'v1'
  })
})

// ─── BOOTSTRAP ────────────────────────────────────────────────────────────────
const start = async () => {
  await connectDB()
  mountRoutes(app)

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` })
  })

  // Global error handler
  const { errorHandler } = require('./src/middleware/errorHandler')
  app.use(errorHandler)

  app.listen(config.server.port, () => {
    logger.info(`🚀 Server running on port ${config.server.port} in ${config.server.env} mode`)
    logger.info(`📋 Allowed origins: ${config.server.allowedOrigins.join(', ')}`)
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      logger.error(`❌ Port ${config.server.port} is already in use.`)
      process.exit(1)
    } else {
      throw err
    }
  })
}

// ─── UNHANDLED REJECTIONS ─────────────────────────────────────────────────────
process.on('unhandledRejection', (reason) => {
  logger.error(`Unhandled Rejection: ${reason}`)
})

process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`)
  process.exit(1)
})

start()

module.exports = app