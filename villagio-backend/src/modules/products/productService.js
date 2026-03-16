const { Product } = require('../../models/productDB')
const { getCache, setCache, invalidateCache } = require('../../utils/cache')
const logger = require('../../utils/logger')

exports.createProduct = async (productData, images, user) => {
    const farmerId = (user.userType === 'admin' && productData.farmerId)
        ? productData.farmerId
        : user.userId

    const newProduct = new Product({
        ...productData,
        farmer: farmerId,
        images,
    })
    const saved = await newProduct.save()

    // Invalidate product caches on mutation
    await invalidateCache('products:*')

    logger.info(`Product created: ${saved._id} by user ${user.userId}`)
    return saved
}

exports.fetchAllProducts = async () => {
    const cacheKey = 'products:all'
    const cached = await getCache(cacheKey)
    if (cached) return cached

    const products = await Product.find()
        .populate('farmer', 'name email phone')
        .sort({ createdAt: -1 })

    await setCache(cacheKey, products, 5 * 60) // 5 min cache
    return products
}

exports.fetchProductById = async (productId) => {
    const cacheKey = `products:${productId}`
    const cached = await getCache(cacheKey)
    if (cached) return cached

    const product = await Product.findById(productId)
        .populate('farmer', 'name email phone')

    if (!product) {
        const error = new Error('Product not found')
        error.status = 404
        throw error
    }

    await setCache(cacheKey, product, 5 * 60)
    return product
}

exports.modifyProduct = async (productId, updateData, images, user) => {
    const product = await Product.findById(productId)
    if (!product) {
        const error = new Error('Product not found')
        error.status = 404
        throw error
    }

    if (user.userType !== 'admin' && product.farmer.toString() !== user.userId) {
        const error = new Error('You can only update your own products')
        error.status = 403
        throw error
    }

    const payload = { ...updateData }
    if (images && images.length > 0) {
        payload.images = images
    }

    const updated = await Product.findByIdAndUpdate(productId, payload, { new: true, runValidators: true })

    await invalidateCache(`products:${productId}`)
    await invalidateCache('products:all')
    await invalidateCache('products:search:*')

    logger.info(`Product updated: ${productId} by user ${user.userId}`)
    return updated
}

exports.removeProduct = async (productId, user) => {
    const product = await Product.findById(productId)
    if (!product) {
        const error = new Error('Product not found')
        error.status = 404
        throw error
    }

    if (user.userType !== 'admin' && product.farmer.toString() !== user.userId) {
        const error = new Error('You can only delete your own products')
        error.status = 403
        throw error
    }

    await Product.findByIdAndDelete(productId)

    await invalidateCache(`products:${productId}`)
    await invalidateCache('products:all')
    await invalidateCache('products:search:*')

    logger.info(`Product deleted: ${productId} by user ${user.userId}`)
}

exports.queryProducts = async ({ category, minPrice, maxPrice, search, page = 1, limit = 20 }) => {
    const queryObj = { category, minPrice, maxPrice, search, page, limit }
    const cacheKey = `products:search:${JSON.stringify(queryObj)}`
    const cached = await getCache(cacheKey)
    if (cached) return cached

    const filter = { isAvailable: true }

    if (category) filter.category = category
    if (search) {
        filter.$or = [
            { name: { $regex: search.trim(), $options: 'i' } },
            { description: { $regex: search.trim(), $options: 'i' } }
        ]
    }
    if (minPrice || maxPrice) {
        filter.price = {}
        if (minPrice) filter.price.$gte = parseFloat(minPrice)
        if (maxPrice) filter.price.$lte = parseFloat(maxPrice)
    }

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const [results, total] = await Promise.all([
        Product.find(filter)
            .populate('farmer', 'name email')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 }),
        Product.countDocuments(filter),
    ])

    const response = {
        results,
        pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    }

    await setCache(cacheKey, response, 3 * 60) // 3 min
    return response
}
