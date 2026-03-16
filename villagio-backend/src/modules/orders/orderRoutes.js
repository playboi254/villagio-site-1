const express = require('express')
const orderController = require('./orderController')
const { authMiddleware, roleMiddleware } = require('../../middleware/authMiddleware')
const { validate } = require('../../middleware/validateMiddleware')
const { createOrderSchema, updateOrderStatusSchema } = require('../../utils/schemas')

const router = express.Router()

router.post('/', authMiddleware, validate(createOrderSchema), orderController.createOrder)
router.get('/', authMiddleware, roleMiddleware(['admin']), orderController.getAllOrders)
router.get('/user', authMiddleware, orderController.getUserOrders)
router.get('/:id', authMiddleware, orderController.getOrderById)
router.put('/:id/status', authMiddleware, roleMiddleware(['admin']), validate(updateOrderStatusSchema), orderController.updateOrderStatus)
router.put('/:id/cancel', authMiddleware, orderController.cancelOrder)

module.exports = router
