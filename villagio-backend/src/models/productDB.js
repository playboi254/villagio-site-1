const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: {
        type: String,
        enum: ['Vegetables', 'Fruits', 'Dairy and Eggs', 'Herbs and Spices', 'Grains and Cereals'],
        required: true
    },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, default: 0, min: 0 },
    unit: { type: String, default: 'kg' },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    images: { type: [String], default: [] },
    isAvailable: { type: Boolean, default: true },
    location: {
        county: String,
        area: String,
        estate: String
    },
}, { timestamps: true })

// ─── Indexes ──────────────────────────────────────────────────────────────────
productSchema.index({ name: 'text', description: 'text' })   // full-text search
productSchema.index({ category: 1 })
productSchema.index({ price: 1 })
productSchema.index({ farmer: 1 })
productSchema.index({ isAvailable: 1 })
productSchema.index({ createdAt: -1 })

module.exports = {
    Product: mongoose.model('Product', productSchema)
}
