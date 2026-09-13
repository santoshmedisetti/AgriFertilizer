import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Inventory from '../models/Inventory.js';
import StockTransaction from '../models/StockTransaction.js';
import { sendOrderStatusEmail } from '../services/emailService.js';
import Coupon from '../models/Coupon.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import logger from '../config/logger.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      discount,
      totalPrice,
      expectedDeliveryDate,
      couponApplied
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      const err = new Error('No order items');
      err.status = 400;
      return next(err);
    }

    const orderNumber = 'AGRI-' + crypto.randomBytes(4).toString('hex').toUpperCase();

    const order = new Order({
      orderNumber,
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      discount,
      totalPrice,
      expectedDeliveryDate: expectedDeliveryDate || new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // Default 5 days
      couponApplied,
      isPaid: false,
      status: 'Pending',
      statusHistory: [{ status: 'Pending' }]
    });

    const createdOrder = await order.save();

    // Auto reduce stock in Inventory module
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      
      let inventory = await Inventory.findOne({ productId: product._id });
      if (!inventory) {
        inventory = new Inventory({ productId: product._id, currentStock: product.countInStock });
      }

      inventory.currentStock -= item.qty;
      await inventory.save();

      product.countInStock = inventory.currentStock;
      await product.save();

      await StockTransaction.create({
        product: product._id,
        quantity: item.qty,
        transactionType: 'Stock Out',
        reason: `Order Placed: ${createdOrder.orderNumber}`,
        notes: `System auto-deduct for order ${createdOrder._id}`
      });
    }

    // Clear user's cart after placing order
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    // Update coupon usage if applied
    if (couponApplied) {
      const coupon = await Coupon.findOne({ code: couponApplied.toUpperCase() });
      if (coupon) {
        coupon.totalUsed += 1;
        const userUsage = coupon.usedBy.find(u => u.user.toString() === req.user._id.toString());
        if (userUsage) {
          userUsage.count += 1;
        } else {
          coupon.usedBy.push({ user: req.user._id, count: 1 });
        }
        await coupon.save();
      }
    }

    logger.info(`Order placed successfully: ${createdOrder.orderNumber}`, { orderId: createdOrder._id, userId: req.user._id });
    res.status(201).json({ success: true, data: createdOrder });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
      // Check if user is admin or the order belongs to the user
      const isOwner = order.user && order.user._id.toString() === req.user._id.toString();
      if (isOwner || req.user.role === 'admin') {
        res.json({ success: true, data: order });
      } else {
        const err = new Error('Not authorized to view this order');
        err.status = 401;
        return next(err);
      }
    } else {
      const err = new Error('Order not found');
      err.status = 404;
      return next(err);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update order to paid (Razorpay)
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

      // Verify Razorpay signature
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        const err = new Error('Invalid signature');
        err.status = 400;
        return next(err);
      }

      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: razorpay_payment_id,
        orderId: razorpay_order_id,
        status: 'Paid',
        update_time: new Date().toISOString(),
      };

      const updatedOrder = await order.save();
      res.json({ success: true, data: updatedOrder });
    } else {
      const err = new Error('Order not found');
      err.status = 404;
      return next(err);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Create Razorpay order
// @route   POST /api/orders/razorpay
// @access  Private
export const createRazorpayOrder = async (req, res, next) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: req.body.amount * 100, // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await instance.orders.create(options);
    if (!order) return res.status(500).send("Some error occured");

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res, next) => {
  try {
    const { search, status } = req.query;
    
    let query = {};
    if (search) {
      query.orderNumber = { $regex: search, $options: 'i' };
    }
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query).populate('user', 'id name').sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      const { status, comment } = req.body;
      
      order.status = req.body.status;
      order.statusHistory.push({ status: req.body.status, comment });

      // Handle return/cancel stock restoration if admin changes status directly
      if (['Cancelled', 'Returned'].includes(req.body.status)) {
        for (const item of order.orderItems) {
          const product = await Product.findById(item.product);
          
          let inventory = await Inventory.findOne({ productId: product._id });
          if (!inventory) {
            inventory = new Inventory({ productId: product._id, currentStock: product.countInStock });
          }

          inventory.currentStock += item.qty;
          await inventory.save();

          product.countInStock = inventory.currentStock;
          await product.save();

          await StockTransaction.create({
            product: product._id,
            quantity: item.qty,
            transactionType: 'Returned Stock',
            reason: `Order ${req.body.status}: ${order.orderNumber}`,
            admin: req.user._id,
            notes: `Admin marked order as ${req.body.status}`
          });
        }
      }

      if (status === 'Delivered') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        // Fallback for COD if paid on delivery
        if (order.paymentMethod === 'COD' && !order.isPaid) {
          order.isPaid = true;
          order.paidAt = Date.now();
        }
      }

      const updatedOrder = await order.save();
      
      // Auto-trigger email and in-app notification
      try {
        await updatedOrder.populate('user', 'name email');
        await sendOrderStatusEmail(updatedOrder.user, updatedOrder, updatedOrder.status);
      } catch (e) {
        console.error('Failed to send order status email/notification:', e);
      }

      logger.info(`Order status updated: ${updatedOrder.orderNumber} to ${updatedOrder.status}`, { orderId: updatedOrder._id, adminId: req.user._id, newStatus: updatedOrder.status });
      res.json({ success: true, data: updatedOrder });
    } else {
      const err = new Error('Order not found');
      err.status = 404;
      return next(err);
    }
  } catch (error) {
    next(error);
  }
};
