const express = require('express');
const router = express.Router();
const paymentController = require('./paymentController');
const { authMiddleware, roleMiddleware } = require('../../middleware/authMiddleware');

// ─── CUSTOMER ROUTES ─────────────────────────────────────────────────────────
router.post('/stk-push', authMiddleware, paymentController.stkPush);

// ─── CALLBACK ROUTE (Public - Safaricom Hook) ────────────────────────────────
router.post('/callback', paymentController.mpesaCallback);

// ─── ADMIN ROUTES ───────────────────────────────────────────────────────────
router.get('/', authMiddleware, roleMiddleware(['admin']), paymentController.getAllPayments);

module.exports = router;
