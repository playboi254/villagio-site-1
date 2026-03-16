const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true }
})

const orderSchema = new mongoose.Schema({
    consumer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        // ✅ UPDATED: full lifecycle pending → confirmed → packing → out-for-delivery → delivered
        enum: ['pending', 'confirmed', 'packing', 'out-for-delivery', 'delivered', 'cancelled'],
        default: 'pending'
    },
    vendorFirstName: { type: String, required: true },
    vendorLastName: { type: String, required: true },
    deliveryAddress: {
        phone: { type: String, required: true },
        streetAddress: { type: String, required: true },
        city: { type: String, required: true },
        county: { type: String, required: true },
        postalCode: { type: String, required: true }
    },
    paymentMethod: {
        type: String,
        enum: ['mpesa', 'credit', 'debit', 'cash_on_delivery'],
        default: 'cash_on_delivery'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    merchantRequestId: { type: String, default: null },
    checkoutRequestId: { type: String, default: null },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true })

// ─── Indexes ──────────────────────────────────────────────────────────────────
orderSchema.index({ consumer: 1, createdAt: -1 })
orderSchema.index({ status: 1 })
orderSchema.index({ createdAt: -1 })
orderSchema.index({ 'deliveryAddress.city': 1 })

module.exports = {
    Order: mongoose.model('Order', orderSchema),
    OrderItem: mongoose.model('OrderItem', orderItemSchema)
}
