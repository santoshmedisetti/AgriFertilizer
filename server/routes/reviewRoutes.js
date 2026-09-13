import express from 'express';
import { 
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
  markHelpful,
  getMyReviews
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/product/:productId').get(getProductReviews);

router.route('/')
  .post(protect, createReview);

router.route('/my').get(protect, getMyReviews);

router.route('/:id')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

router.route('/:id/helpful')
  .post(protect, markHelpful);

export default router;
