import express from 'express';
import { 
  createPaymentOrder,
  verifyPayment,
  paymentWebhook,
  getPaymentHistory,
  getPaymentById,
  recordCODPayment
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-order', protect, createPaymentOrder);
router.post('/verify', protect, verifyPayment);
router.post('/cod', protect, recordCODPayment);
router.post('/webhook', paymentWebhook);
router.get('/history', protect, getPaymentHistory);
router.get('/:id', protect, getPaymentById);

export default router;
