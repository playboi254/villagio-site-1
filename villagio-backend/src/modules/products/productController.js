const productService = require('./productService')
const { upload, handleMulterError } = require('../../middleware/uploadMiddleware')
const { uploadLimiter } = require('../../middleware/rateLimiter')

// Secure upload middleware (use the shared one not raw multer)
exports.uploadProductImages = [uploadLimiter, upload.array('images', 5), handleMulterError]

exports.addProduct = async (req, res, next) => {
    try {
        const images = req.files ? req.files.map(f => `uploads/${f.filename}`) : []
        const product = await productService.createProduct(req.body, images, req.user)
        res.status(201).json({
            success: true,
            message: 'Product added successfully',
            data: { product }
        })
    } catch (error) {
        next(error)
    }
}

exports.getAllProducts = async (req, res, next) => {
    try {
        const products = await productService.fetchAllProducts()
        res.status(200).json({
            success: true,
            message: 'Products retrieved successfully',
            data: { products }
        })
    } catch (error) {
        next(error)
    }
}

exports.getProductById = async (req, res, next) => {
    try {
        const product = await productService.fetchProductById(req.params.id)
        res.status(200).json({
            success: true,
            message: 'Product retrieved successfully',
            data: { product }
        })
    } catch (error) {
        next(error)
    }
}

exports.updateProduct = async (req, res, next) => {
    try {
        const images = (req.files && req.files.length > 0) ? req.files.map(f => `uploads/${f.filename}`) : []
        const updated = await productService.modifyProduct(req.params.id, req.body, images, req.user)
        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: { product: updated }
        })
    } catch (error) {
        next(error)
    }
}

exports.deleteProduct = async (req, res, next) => {
    try {
        await productService.removeProduct(req.params.id, req.user)
        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
            data: null
        })
    } catch (error) {
        next(error)
    }
}

exports.searchProducts = async (req, res, next) => {
    try {
        const response = await productService.queryProducts(req.query)
        res.status(200).json({
            success: true,
            message: 'Products matching search retrieved',
            data: response
        })
    } catch (error) {
        next(error)
    }
}