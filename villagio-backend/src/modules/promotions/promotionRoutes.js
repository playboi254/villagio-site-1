const express = require('express');
const router = express.Router();
const promotionController = require('./promotionController');
const { authMiddleware, roleMiddleware } = require('../../middleware/authMiddleware');

router.get('/', authMiddleware, promotionController.getAllPromotions);
router.post('/', authMiddleware, roleMiddleware(['admin']), promotionController.createPromotion);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), promotionController.deletePromotion);

module.exports = router;
