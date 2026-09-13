import express from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist
} from '../controllers/wishlistController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All wishlist routes require user to be logged in
router.route('/')
  .get(protect, getWishlist)
  .post(protect, addToWishlist);

router.route('/:productId')
  .delete(protect, removeFromWishlist);

export default router;
