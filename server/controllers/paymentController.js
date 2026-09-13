import Razorpay from 'razorpay';
import crypto from 'crypto';
import Payment from '../models/Payment.js';
import Order from '../models/Order.js';

// Initialize Razorpay
// Note: We use try/catch or conditional initialization in case env vars aren't set yet.
let razorpay;
try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
} catch (error) {
  logger.error("Razorpay initialization warning: Keys not found.");
}

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
// @access  Private
export const createPaymentOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    // Amount should be in paise (multiply by 100)
    const options = {
      amount: Math.round(order.totalPrice * 100),
      currency: 'INR',
      receipt: `receipt_order_${order._id}`,
    };

    if (!razorpay) {
      res.status(500);
      throw new Error('Razorpay keys not configured on server.');
    }

    const razorpayOrder = await razorpay.orders.create(options);

    // Create a pending payment record
    await Payment.create({
      orderId: order._id,
      userId: req.user._id,
      razorpayOrderId: razorpayOrder.id,
      amount: order.totalPrice,
      currency: 'INR',
      paymentMethod: 'Razorpay',
      paymentStatus: 'Pending'
    });

    res.status(200).json({
      success: true,
      data: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Payment Signature
// @route   POST /api/payment/verify
// @access  Private
export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Update Payment record
      const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
      if (payment) {
        payment.razorpayPaymentId = razorpay_payment_id;
        payment.razorpaySignature = razorpay_signature;
        payment.paymentStatus = 'Completed';
        payment.transactionDate = Date.now();
        await payment.save();
      }

      // Update Order Status
      const order = await Order.findById(orderId);
      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentMethod = 'Razorpay';
        
        // Also reduce inventory when payment is verified
        // Assuming inventory is reduced here or at order creation. 
        // We will just update order status here.
        const updatedOrder = await order.save();
        
        logger.info(`Payment verified successfully for Order ID: ${order._id}`, { paymentId: razorpay_payment_id });
        res.status(200).json({ success: true, message: 'Payment verified successfully' });
      } else {
        res.status(404);
        throw new Error('Order not found');
      }
    } else {
      logger.warn(`Payment signature verification failed for Order ID: ${orderId}`);
      res.status(400);
      throw new Error('Payment signature verification failed');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Webhook for async events
// @route   POST /api/payment/webhook
// @access  Public
export const paymentWebhook = async (req, res, next) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];
    
    // Verify Webhook Signature
    const expectedSignature = crypto.createHmac('sha256', secret)
                                    .update(JSON.stringify(req.body))
                                    .digest('hex');
    
    if (expectedSignature === signature) {
      // Handle the event
      const event = req.body.event;
      if (event === 'payment.captured') {
        const paymentEntity = req.body.payload.payment.entity;
        const razorpayOrderId = paymentEntity.order_id;
        
        const payment = await Payment.findOne({ razorpayOrderId });
        if (payment && payment.paymentStatus !== 'Completed') {
          payment.paymentStatus = 'Completed';
          payment.razorpayPaymentId = paymentEntity.id;
          await payment.save();

          const order = await Order.findById(payment.orderId);
          if (order && !order.isPaid) {
            order.isPaid = true;
            order.paidAt = Date.now();
            await order.save();
            logger.info(`Webhook: Payment captured for Order ID: ${order._id}`);
          }
        }
      } else if (event === 'payment.failed') {
        const paymentEntity = req.body.payload.payment.entity;
        const razorpayOrderId = paymentEntity.order_id;
        
        const payment = await Payment.findOne({ razorpayOrderId });
        if (payment) {
          payment.paymentStatus = 'Failed';
          await payment.save();
          logger.warn(`Webhook: Payment failed for Order ID: ${payment.orderId}`);
        }
      }
      res.status(200).json({ status: 'ok' });
    } else {
      res.status(400).send('Invalid signature');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's payment history
// @route   GET /api/payment/history
// @access  Private
export const getPaymentHistory = async (req, res, next) => {
  try {
    const payments = await Payment.find({ userId: req.user._id })
      .populate('orderId', 'orderNumber totalPrice status')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: payments });
  } catch (error) {
    next(error);
  }
};

// @desc    Get specific payment details
// @route   GET /api/payment/:id
// @access  Private
export const getPaymentById = async (req, res, next) => {
  try {
    const payment = await Payment.findOne({ _id: req.params.id, userId: req.user._id })
      .populate('orderId');

    if (!payment) {
      res.status(404);
      throw new Error('Payment not found');
    }

    res.json({ success: true, data: payment });
  } catch (error) {
    next(error);
  }
};

// @desc    Record a COD payment (cash on delivery)
// @route   POST /api/payment/cod
// @access  Private
export const recordCODPayment = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    await Payment.create({
      orderId: order._id,
      userId: req.user._id,
      amount: order.totalPrice,
      currency: 'INR',
      paymentMethod: 'COD',
      paymentStatus: 'Pending'
    });

    order.paymentMethod = 'COD';
    order.isPaid = false;
    await order.save();

    res.json({ success: true, message: 'COD Order recorded' });
  } catch (error) {
    next(error);
  }
};
