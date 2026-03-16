// ─── Rate Limiting Middleware ─────────────────────────────────────────────────
const rateLimit = require('express-rate-limit')

/**
 * Global limiter – applies to all routes
 * 200 req / 15 min per IP
 */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // Stricter limit for production
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many requests. Please try again later.',
  },
})

/**
 * Auth limiter – tight limits on login/register to prevent brute-force
 * 20 req / 15 min per IP
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many authentication attempts. Please try again later.',
  },
})

/**
 * Upload limiter – prevent upload flooding
 * 30 req / 10 min per IP
 */
const uploadLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many upload requests. Please slow down.',
  },
})

module.exports = { globalLimiter, authLimiter, uploadLimiter }
