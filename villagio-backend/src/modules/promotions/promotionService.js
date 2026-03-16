const { Promotion } = require('../../models/promotionDB');

exports.fetchAllPromotions = async () => {
    return await Promotion.find().sort({ createdAt: -1 });
};

exports.createPromotion = async (promotionData) => {
    const { name, code, discount, type, startDate, endDate, usageLimit, minOrder } = promotionData;
    
    const existing = await Promotion.findOne({ code: code.toUpperCase() });
    if (existing) {
        const err = new Error('Promotion code already exists');
        err.status = 400;
        throw err;
    }

    const newPromotion = new Promotion({
        name,
        code,
        discount,
        type,
        startDate,
        endDate,
        usageLimit,
        minOrder,
    });

    return await newPromotion.save();
};

exports.deletePromotion = async (promotionId) => {
    const deleted = await Promotion.findByIdAndDelete(promotionId);
    if (!deleted) {
        const err = new Error('Promotion not found');
        err.status = 404;
        throw err;
    }
    return deleted;
};
