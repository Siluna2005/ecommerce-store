const { generateHash } = require('../config/payhere');

/**
 * Get PayHere configuration
 */
const getPayHereConfig = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      merchantId: process.env.PAYHERE_MERCHANT_ID,
      mode: process.env.PAYHERE_MODE || 'sandbox'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Create payment request
 */
const createPayment = async (req, res) => {
  try {
    const { orderId, amount, items, customer } = req.body;
    
    const merchantId = process.env.PAYHERE_MERCHANT_ID;
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;
    const currency = 'LKR'; // Sri Lankan Rupees
    
    // Generate secure hash
    const hash = generateHash(merchantId, orderId, amount, currency, merchantSecret);
    
    // Return payment configuration
    res.status(200).json({
      success: true,
      paymentData: {
        merchant_id: merchantId,
        return_url: `${process.env.FRONTEND_URL}/pages/order-success.html`,
        cancel_url: `${process.env.FRONTEND_URL}/pages/checkout.html`,
        notify_url: `${process.env.BACKEND_URL}/api/payment/payhere/notify`,
        order_id: orderId,
        items: items,
        currency: currency,
        amount: amount,
        first_name: customer.firstName,
        last_name: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        country: 'Sri Lanka',
        hash: hash
      }
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating payment'
    });
  }
};

/**
 * Handle PayHere notification (webhook)
 */
const handlePayHereNotify = async (req, res) => {
  try {
    const {
      merchant_id,
      order_id,
      payment_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
      status_message
    } = req.body;
    
    // Verify hash for security
    const { verifyHash } = require('../config/payhere');
    const isValid = verifyHash(
      merchant_id,
      order_id,
      payhere_amount,
      status_code,
      md5sig
    );
    
    if (!isValid) {
      console.error('Invalid PayHere notification hash');
      return res.status(400).send('Invalid hash');
    }
    
    // Update order payment status
    const Order = require('../models/Order');
    const order = await Order.findOne({ orderNumber: order_id });
    
    if (!order) {
      console.error('Order not found:', order_id);
      return res.status(404).send('Order not found');
    }
    
    // Status codes: 2 = success, 0 = pending, -1 = canceled, -2 = failed, -3 = chargedback
    if (status_code === '2') {
      order.paymentStatus = 'paid';
      order.paidAt = Date.now();
      order.paymentResult = {
        id: payment_id,
        status: status_message,
        update_time: new Date().toISOString()
      };
      order.orderStatus = 'processing';
    } else if (status_code === '0') {
      order.paymentStatus = 'pending';
    } else {
      order.paymentStatus = 'failed';
    }
    
    await order.save();
    
    console.log(`Payment notification processed for order: ${order_id}, status: ${status_code}`);
    res.status(200).send('OK');
    
  } catch (error) {
    console.error('PayHere notification error:', error);
    res.status(500).send('Error processing notification');
  }
};

module.exports = {
  getPayHereConfig,
  createPayment,
  handlePayHereNotify
};