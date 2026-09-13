import nodemailer from 'nodemailer';
import Notification from '../models/Notification.js';

let transporter;
try {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: process.env.SMTP_PORT || 2525,
    auth: {
      user: process.env.SMTP_USER || 'user',
      pass: process.env.SMTP_PASS || 'pass',
    },
  });
} catch (error) {
  console.log('Nodemailer initialization warning:', error.message);
}

const sendEmail = async (options) => {
  if (!transporter) {
    console.log('Email mocked (Nodemailer not configured):', options.subject);
    return;
  }
  
  const mailOptions = {
    from: `"Agriftilizer Support" <${process.env.FROM_EMAIL || 'noreply@agriftilizer.com'}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// ------------------------------------------------------------------
// TEMPLATES & TRIGGERS
// ------------------------------------------------------------------

export const sendWelcomeEmail = async (user) => {
  const html = `
    <h2>Welcome to Agriftilizer, ${user.name}!</h2>
    <p>Thank you for registering. You can now purchase top-quality fertilizers for your farm.</p>
  `;
  await sendEmail({ email: user.email, subject: 'Welcome to Agriftilizer', html });
};

export const sendOrderStatusEmail = async (user, order, status) => {
  const statusMessages = {
    'Confirmed': 'Your order has been confirmed and is being processed.',
    'Packed': 'Your order has been packed and is ready for shipping.',
    'Shipped': 'Your order has been shipped and is on its way.',
    'Out for Delivery': 'Your order is out for delivery today!',
    'Delivered': 'Your order has been delivered successfully. Thank you for shopping with us!',
    'Cancelled': 'Your order has been cancelled.'
  };

  const html = `
    <h2>Order Status Update</h2>
    <p>Hi ${user.name},</p>
    <p>The status for your order <strong>#${order.orderNumber || order._id.toString().substring(0,8)}</strong> is now: <strong>${status}</strong>.</p>
    <p>${statusMessages[status] || ''}</p>
    <br/>
    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard/orders" style="padding:10px 20px; background-color:#16a34a; color:white; text-decoration:none; border-radius:5px;">Track Order</a>
  `;
  
  await sendEmail({ email: user.email, subject: `Order Update: ${status}`, html });

  // Also create an in-app notification
  try {
    await Notification.create({
      user: user._id,
      title: `Order ${status}`,
      message: `Your order #${order.orderNumber || order._id.toString().substring(0,8)} is now ${status}.`,
      type: 'Order',
      link: `/dashboard/orders`
    });
  } catch (err) {
    console.error('Failed to create in-app notification', err);
  }
};

export const sendPaymentStatusEmail = async (user, order, status) => {
  const html = `
    <h2>Payment ${status}</h2>
    <p>Hi ${user.name},</p>
    <p>Your payment for order <strong>#${order.orderNumber || order._id.toString().substring(0,8)}</strong> was <strong>${status}</strong>.</p>
  `;
  await sendEmail({ email: user.email, subject: `Payment ${status}`, html });

  try {
    await Notification.create({
      user: user._id,
      title: `Payment ${status}`,
      message: `Payment for order #${order.orderNumber || order._id.toString().substring(0,8)} was ${status}.`,
      type: 'System',
    });
  } catch (err) {
    console.error('Failed to create in-app notification', err);
  }
};
