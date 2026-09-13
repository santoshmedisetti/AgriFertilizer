import express from 'express';
import {
  getInventoryOverview,
  getInventoryByProduct,
  stockIn,
  stockOut,
  adjustStock,
  getInventoryHistory
} from '../controllers/inventoryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, admin);

router.route('/').get(getInventoryOverview);
router.route('/history').get(getInventoryHistory);
router.route('/stock-in').post(stockIn);
router.route('/stock-out').post(stockOut);
router.route('/adjust').post(adjustStock);
router.route('/:productId').get(getInventoryByProduct);

export default router;
