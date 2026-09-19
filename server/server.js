import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import logger from './config/logger.js';
import seedAdmin from './utils/seedAdmin.js';
import seedData from './utils/seedData.js';
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import brandRoutes from './routes/brandRoutes.js';
import productRoutes from './routes/productRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import erpRoutes from './routes/erpRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import supportRoutes from './routes/supportRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import { initializeAI } from './services/aiService.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

// Environment Validation
logger.info(`AI Provider: ${process.env.AI_PROVIDER || 'gemini'}`);
logger.info(`AI Model: ${process.env.AI_MODEL ? 'configured' : 'missing'}`);
logger.info(`AI API Key: ${process.env.AI_API_KEY && process.env.AI_API_KEY !== 'dummy_key_for_now' ? 'configured' : 'missing'}`);

// Connect to database
connectDB().then(async () => {
  // Seed default admin if none exists
  await seedAdmin();
  // Seed sample data if collections are empty
  await seedData();
  
  // Initialize AI Provider
  initializeAI();
});

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Security middleware
// Security middleware
app.use(helmet());

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://agri-fertilizer-topaz.vercel.app'
  ],
  credentials: true
}));

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 200, // limit each IP to 200 requests per windowMs
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api/', globalLimiter);

// Strict limiters for sensitive routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5, // 5 requests per 15 minutes
  message: { success: false, message: 'Too many auth attempts, please try again after 15 minutes.' }
});

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { success: false, message: 'Too many payment requests.' }
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/payment', paymentLimiter);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // Logging
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/erp', erpRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/invoice', invoiceRoutes);
app.use('/api/ai', aiRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.json({ message: 'API is running...' });
});
// Favicon
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});
// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    dbState: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Handle 404 (Not Found)
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

