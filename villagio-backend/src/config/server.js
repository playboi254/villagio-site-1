module.exports = {
  port: parseInt(process.env.PORT, 10) || 8000,
  env: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  allowedOrigins: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:8000',
    'http://localhost:8001',
    process.env.CLIENT_URL,
    process.env.ADMIN_URL,
  ].filter(Boolean),
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD || '',
  },
  upload: {
    maxSizeMB: parseInt(process.env.UPLOAD_MAX_SIZE_MB, 10) || 2, // Enforced 2MB limit
    cdnUrl: process.env.CDN_URL || '',
  },
  mpesa: {
    consumerKey: process.env.MPESA_CONSUMER_KEY,
    consumerSecret: process.env.MPESA_CONSUMER_SECRET,
    passKey: process.env.MPESA_PASS_KEY,
    shortCode: process.env.MPESA_SHORTCODE,
    callbackUrl: process.env.MPESA_CALLBACK_URL,
    env: process.env.MPESA_ENV || 'sandbox',
  }
}
