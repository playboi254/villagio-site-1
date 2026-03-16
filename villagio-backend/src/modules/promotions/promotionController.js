const promotionService = require('./promotionService');

// Get all promotions
exports.getAllPromotions = async (req, res, next) => {
    try {
        const promotions = await promotionService.fetchAllPromotions();
        res.status(200).json({
            success: true,
            message: 'Promotions retrieved successfully',
            data: { promotions }
        });
    } catch (error) {
        next(error);
    }
};

// Create promotion
exports.createPromotion = async (req, res, next) => {
    try {
        const newPromotion = await promotionService.createPromotion(req.body);
        res.status(201).json({
            success: true,
            message: 'Promotion created successfully',
            data: { promotion: newPromotion }
        });
    } catch (error) {
        next(error);
    }
};

// Delete promotion
exports.deletePromotion = async (req, res, next) => {
    try {
        await promotionService.deletePromotion(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Promotion deleted successfully',
            data: null
        });
    } catch (error) {
        next(error);
    }
};
