module.exports = {
  jwt: {
    secret: process.env.JWT_SECRET || 'villagio_secret_key_change_in_production',
    expiresIn: '24h', // default token expiration
  },
  rateLimit: {
    global: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    },
    auth: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 5, // Limit each IP to 5 auth requests per window
    },
    upload: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 20, // Limit each IP to 20 uploads per hour
    }
  },
  sentry: {
    dsn: process.env.SENTRY_DSN || '',
  }
}
