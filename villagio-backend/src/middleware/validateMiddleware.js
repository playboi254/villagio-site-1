// ─── Centralized Request Validation Middleware ────────────────────────────────

/**
 * Creates an Express middleware that validates req.body against a Joi schema.
 * @param {import('joi').ObjectSchema} schema - Joi schema
 */
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  })
  if (error) {
    const messages = error.details.map((d) => d.message)
    return res.status(400).json({ message: 'Validation error', errors: messages })
  }
  req.body = value
  next()
}

/**
 * Creates an Express middleware that validates req.query against a Joi schema.
 */
const validateQuery = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.query, {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
  })
  if (error) {
    const messages = error.details.map((d) => d.message)
    return res.status(400).json({ message: 'Query validation error', errors: messages })
  }
  req.query = value
  next()
}

module.exports = { validate, validateQuery }
