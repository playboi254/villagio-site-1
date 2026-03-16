const express = require('express')
const productController = require('./productController')
const { authMiddleware, roleMiddleware } = require('../../middleware/authMiddleware')
const { validate } = require('../../middleware/validateMiddleware')
const { createProductSchema, updateProductSchema, searchProductsSchema } = require('../../utils/schemas')
const { validateQuery } = require('../../middleware/validateMiddleware')
const { handleMulterError } = require('../../middleware/uploadMiddleware')

const router = express.Router()

router.post('/', authMiddleware, roleMiddleware(['farmer', 'admin']), ...productController.uploadProductImages, validate(createProductSchema), productController.addProduct)
router.get('/', productController.getAllProducts)
router.get('/search', validateQuery(searchProductsSchema), productController.searchProducts)
router.get('/:id', productController.getProductById)
router.put('/:id', authMiddleware, ...productController.uploadProductImages, validate(updateProductSchema), productController.updateProduct)
router.delete('/:id', authMiddleware, productController.deleteProduct)

module.exports = router