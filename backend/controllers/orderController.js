const Order = require('../models/Order');
const Product = require('../models/Product');
const { sendOrderConfirmation } = require('../utils/sendEmail');

// Create new order
const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      notes
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items provided'
      });
    }

    // Create order
    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      notes
    });

    // Update product stock
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock -= item.quantity;
        await product.save();
      }
    }

    // Send order confirmation email
    await sendOrderConfirmation({
      email: req.user.email,
      name: req.user.name,
      orderId: order.orderNumber,
      products: orderItems,
      totalAmount: totalPrice
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating order'
    });
  }
};

// Get user orders
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('orderItems.product', 'name imageUrl')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching orders'
    });
  }
};

// Get single order
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name imageUrl');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching order'
    });
  }
};

// Get all orders (Admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('orderItems.product', 'name imageUrl')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching orders'
    });
  }
};

// Update order status (Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, trackingNumber } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.orderStatus = orderStatus || order.orderStatus;
    if (trackingNumber) order.trackingNumber = trackingNumber;

    if (orderStatus === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating order status'
    });
  }
};

// Update payment status
const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus, paymentResult } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.paymentStatus = paymentStatus;
    if (paymentResult) order.paymentResult = paymentResult;
    if (paymentStatus === 'paid') order.paidAt = Date.now();

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment status updated',
      order
    });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating payment status'
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus
};