const paymentService = require('./paymentService');

// M-Pesa STK Push Initiation
exports.stkPush = async (req, res, next) => {
    try {
        const { orderId, phone, amount } = req.body;
        const result = await paymentService.initiateStkPush(orderId, phone, amount);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// M-Pesa Callback Endpoint (No Auth - called by Safaricom)
exports.mpesaCallback = async (req, res, next) => {
    try {
        await paymentService.handleCallback(req.body);
        res.status(200).json({ ResultCode: 0, ResultDesc: 'Success' });
    } catch (error) {
        // Even on error, return 0 to Safaricom to avoid retries if we handled it
        res.status(200).json({ ResultCode: 0, ResultDesc: 'Success with internal error' });
    }
};

// Admin: Get all payments
exports.getAllPayments = async (req, res, next) => {
    try {
        const payments = await paymentService.getAllCompletedPayments();
        res.status(200).json({
            success: true,
            message: 'Payments retrieved successfully',
            data: { payments }
        });
    } catch (error) {
        next(error);
    }
};
