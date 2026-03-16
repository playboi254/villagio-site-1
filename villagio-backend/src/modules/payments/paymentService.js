const axios = require('axios');
const { Order } = require('../../models/orderDB');
const config = require('../../config/index');
const logger = require('../../utils/logger');

/**
 * Get M-Pesa OAuth Token
 */
const getOAuthToken = async () => {
    const { consumerKey, consumerSecret, env } = config.server.mpesa;
    const url = env === 'sandbox' 
        ? 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
        : 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

    try {
        const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
        const response = await axios.get(url, {
            headers: { Authorization: `Basic ${auth}` }
        });
        return response.data.access_token;
    } catch (error) {
        logger.error(`M-Pesa OAuth Token Error: ${error.response ? JSON.stringify(error.response.data) : error.message}`);
        throw new Error('Failed to authenticate with M-Pesa');
    }
};

/**
 * Process STK Push
 */
exports.initiateStkPush = async (orderId, phone, amount) => {
    const order = await Order.findById(orderId);
    if (!order) {
        const err = new Error('Order not found');
        err.status = 404;
        throw err;
    }

    // Format phone: 254XXXXXXXXX
    let formattedPhone = phone.replace('+', '').replace(/^0/, '254');
    if (!formattedPhone.startsWith('254')) {
        formattedPhone = '254' + formattedPhone;
    }

    const { shortCode, passKey, callbackUrl, env } = config.server.mpesa;
    const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
    const password = Buffer.from(`${shortCode}${passKey}${timestamp}`).toString('base64');
    
    const url = env === 'sandbox'
        ? 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
        : 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

    try {
        const token = await getOAuthToken();
        const response = await axios.post(url, {
            BusinessShortCode: shortCode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: Math.round(amount),
            PartyA: formattedPhone,
            PartyB: shortCode,
            PhoneNumber: formattedPhone,
            CallBackURL: callbackUrl,
            AccountReference: `Order_${orderId.toString().slice(-6)}`,
            TransactionDesc: 'Payment for Villagio Farm Fresh'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        // Save Request IDs to Order for reconciliation
        order.merchantRequestId = response.data.MerchantRequestID;
        order.checkoutRequestId = response.data.CheckoutRequestID;
        await order.save();

        logger.info(`M-Pesa STK Push initiated for Order ${orderId}: ${response.data.MerchantRequestID}`);
        
        return {
            success: true,
            message: 'STK Push initiated successfully',
            data: response.data
        };
    } catch (error) {
        logger.error(`M-Pesa STK Push Error: ${error.response ? JSON.stringify(error.response.data) : error.message}`);
        throw new Error('Failed to initiate M-Pesa payment');
    }
};

/**
 * Handle M-Pesa Callback
 */
exports.handleCallback = async (callbackData) => {
    const { Body } = callbackData;
    if (!Body || !Body.stkCallback) {
        logger.warn('Invalid M-Pesa callback data received');
        return;
    }

    const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = Body.stkCallback;

    const order = await Order.findOne({ checkoutRequestId: CheckoutRequestID });
    
    if (!order) {
        logger.error(`Order not found for CheckoutRequestID: ${CheckoutRequestID}`);
        return;
    }

    if (ResultCode === 0) {
        // Payment successful
        order.paymentStatus = 'completed';
        order.status = 'confirmed'; // Auto-confirm on payment
        
        const receiptItem = CallbackMetadata.Item.find(i => i.Name === 'MpesaReceiptNumber');
        const receipt = receiptItem ? receiptItem.Value : 'N/A';

        logger.info(`Payment SUCCESS for Order ${order._id}: ${receipt} (CheckoutID: ${CheckoutRequestID})`);
    } else {
        order.paymentStatus = 'failed';
        logger.warn(`Payment FAILED for Order ${order._id}: ${ResultDesc} (CheckoutID: ${CheckoutRequestID})`);
    }

    await order.save();
};

exports.getAllCompletedPayments = async () => {
    return await Order.find({ paymentStatus: 'completed' })
        .populate('consumer', 'name email phone')
        .sort({ updatedAt: -1 });
};
