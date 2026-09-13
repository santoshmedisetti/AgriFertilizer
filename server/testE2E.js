import mongoose from 'mongoose';
import dotenv from 'dotenv';
import crypto from 'crypto';
import User from './models/User.js';
import Order from './models/Order.js';

dotenv.config();

const runTest = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Create Customer A
    const emailA = `customerA_${Date.now()}@test.com`;
    const customerA = await User.create({
      name: 'Customer A',
      email: emailA,
      password: 'password123',
    });
    
    // Create Customer B
    const emailB = `customerB_${Date.now()}@test.com`;
    const customerB = await User.create({
      name: 'Customer B',
      email: emailB,
      password: 'password123',
    });

    console.log(`Customer A created: ${customerA._id}`);
    console.log(`Customer B created: ${customerB._id}`);

    // Simulate order placement for Customer A
    const orderNumber = 'AGRI-' + crypto.randomBytes(4).toString('hex').toUpperCase();
    const order = await Order.create({
      orderNumber,
      orderItems: [{
        name: 'Test Product',
        qty: 1,
        image: '/images/test.jpg',
        price: 100,
        product: '6a5b96b3ecac4375541a2b73'
      }],
      user: customerA._id,
      shippingAddress: {
        fullName: 'Customer A',
        street: '123 Main St',
        city: 'City',
        state: 'State',
        pinCode: '123456',
        phone: '9999999999'
      },
      paymentMethod: 'COD',
      itemsPrice: 100,
      taxPrice: 18,
      shippingPrice: 50,
      totalPrice: 168,
      isPaid: false,
      status: 'Pending',
      statusHistory: [{ status: 'Pending' }]
    });

    console.log(`Order placed for Customer A: ${order._id}`);

    // Verify Dashboard queries for A
    const ordersA = await Order.find({ user: customerA._id }).lean();
    console.log(`Dashboard A Total Orders: ${ordersA.length}`);

    // Verify Dashboard queries for B
    const ordersB = await Order.find({ user: customerB._id }).lean();
    console.log(`Dashboard B Total Orders: ${ordersB.length}`);

    // Admin view
    const adminOrders = await Order.find().lean();
    const foundAdminOrder = adminOrders.find(o => o._id.toString() === order._id.toString());
    console.log(`Admin can see order: ${!!foundAdminOrder}`);

    // Update status to Delivered (Testing Casing issue)
    order.status = 'Delivered';
    await order.save();

    const ordersAUpdated = await Order.find({ user: customerA._id }).lean();
    const deliveredCount = ordersAUpdated.filter(o => o.status === 'Delivered').length;
    console.log(`Dashboard A Delivered Orders: ${deliveredCount}`);

    console.log("TEST SUCCESSFUL");

  } catch (error) {
    console.error("Test Failed", error);
  } finally {
    mongoose.disconnect();
  }
};

runTest();
