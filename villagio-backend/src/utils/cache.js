// ─── Redis Cache Layer ────────────────────────────────────────────────────────
const logger = require('../utils/logger')

let redisClient = null
let isRedisAvailable = false

// Try to connect to Redis – if unavailable, fall back gracefully
;(async () => {
  try {
    const Redis = require('ioredis')
    const client = new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD || undefined,
      lazyConnect: true,
      retryStrategy: () => null, // Don't retry on failure
    })

    await client.connect()
    redisClient = client
    isRedisAvailable = true
    logger.info('✅ Redis connected')

    client.on('error', (err) => {
      if (isRedisAvailable) {
        logger.warn(`Redis error – falling back to no-cache: ${err.message}`)
        isRedisAvailable = false
      }
    })
  } catch (err) {
    logger.warn(`Redis unavailable – caching disabled: ${err.message}`)
  }
})()

const DEFAULT_TTL = 5 * 60 // 5 minutes

/**
 * Get cached value by key
 * @param {string} key
 * @returns {Promise<any|null>}
 */
const getCache = async (key) => {
  if (!isRedisAvailable || !redisClient) return null
  try {
    const value = await redisClient.get(key)
    return value ? JSON.parse(value) : null
  } catch {
    return null
  }
}

/**
 * Set a value in cache with optional TTL in seconds
 * @param {string} key
 * @param {any} value
 * @param {number} ttl – seconds
 */
const setCache = async (key, value, ttl = DEFAULT_TTL) => {
  if (!isRedisAvailable || !redisClient) return
  try {
    await redisClient.set(key, JSON.stringify(value), 'EX', ttl)
  } catch {
    // Silently fail
  }
}

/**
 * Delete a cache key or pattern
 * @param {string} pattern – key or glob pattern
 */
const invalidateCache = async (pattern) => {
  if (!isRedisAvailable || !redisClient) return
  try {
    const keys = await redisClient.keys(pattern)
    if (keys.length > 0) {
      await redisClient.del(...keys)
    }
  } catch {
    // Silently fail
  }
}

module.exports = { getCache, setCache, invalidateCache }
