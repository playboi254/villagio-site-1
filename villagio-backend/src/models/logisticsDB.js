const mongoose = require('mongoose')

const deliveryZoneSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String },
    baseFee: { type: Number, required: true, min: 0 },
    isAvailable: { type: Boolean, default: true },
    coordinates: {
        type: { type: String, enum: ['Polygon'], default: 'Polygon' },
        coordinates: { type: [[[Number]]], required: true } // format: [[[lng, lat], ...]]
    }
}, { timestamps: true })

deliveryZoneSchema.index({ coordinates: '2dsphere' })

module.exports = {
    DeliveryZone: mongoose.model('DeliveryZone', deliveryZoneSchema)
}
