// ─── Joi Validation Schemas ───────────────────────────────────────────────────
const Joi = require('joi')

// Auth
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .max(100)
    .regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])/)
    .message('Password must be at least 8 characters long and contain at least one number and one special character')
    .required(),
  userType: Joi.string().valid('customer', 'farmer').required(),
})

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(1).required(),
})

const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  phone: Joi.string().max(20),
  email: Joi.string().email(),
  currentPassword: Joi.string(),
  newPassword: Joi.string()
    .min(8)
    .max(100)
    .regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])/)
    .message('New password must be at least 8 characters long and contain at least one number and one special character'),
})

// Products
const createProductSchema = Joi.object({
  name: Joi.string().min(2).max(200).required(),
  description: Joi.string().max(2000),
  category: Joi.string()
    .valid('Vegetables', 'Fruits', 'Dairy and Eggs', 'Herbs and Spices', 'Grains and Cereals')
    .required(),
  price: Joi.number().positive().required(),
  quantity: Joi.number().min(0).default(0),
  unit: Joi.string().max(20).default('kg'),
  farmerId: Joi.string(),
  'location.county': Joi.string().max(100),
  'location.area': Joi.string().max(100),
  'location.estate': Joi.string().max(100),
})

const updateProductSchema = Joi.object({
  name: Joi.string().min(2).max(200),
  description: Joi.string().max(2000),
  category: Joi.string().valid('Vegetables', 'Fruits', 'Dairy and Eggs', 'Herbs and Spices', 'Grains and Cereals'),
  price: Joi.number().positive(),
  quantity: Joi.number().min(0),
  unit: Joi.string().max(20),
  isAvailable: Joi.boolean(),
  'location.county': Joi.string().max(100),
  'location.area': Joi.string().max(100),
  'location.estate': Joi.string().max(100),
})

const searchProductsSchema = Joi.object({
  category: Joi.string().valid('Vegetables', 'Fruits', 'Dairy and Eggs', 'Herbs and Spices', 'Grains and Cereals'),
  minPrice: Joi.number().min(0),
  maxPrice: Joi.number().min(0),
  search: Joi.string().max(100),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20),
})

// Orders
const createOrderSchema = Joi.object({
  items: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required(),
        price: Joi.number().positive().required(),
      })
    )
    .min(1)
    .required(),
  deliveryAddress: Joi.object({
    phone: Joi.string().required(),
    streetAddress: Joi.string().required(),
    city: Joi.string().required(),
    county: Joi.string().required(),
    postalCode: Joi.string().required(),
  }).required(),
  paymentMethod: Joi.string().valid('mpesa', 'credit', 'debit', 'cash_on_delivery').required(),
})

const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'confirmed', 'packing', 'out-for-delivery', 'delivered', 'cancelled')
    .required(),
})

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  createProductSchema,
  updateProductSchema,
  searchProductsSchema,
  createOrderSchema,
  updateOrderStatusSchema,
}
