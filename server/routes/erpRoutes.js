import express from 'express';
import {
  exportProductsCSV,
  adjustInventory,
  getBanners,
  createBanner,
  deleteBanner
} from '../controllers/erpController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Banners
router.route('/banners')
  .get(getBanners)
  .post(protect, admin, createBanner);
router.route('/banners/:id')
  .delete(protect, admin, deleteBanner);

// Inventory
router.route('/inventory/adjust').post(protect, admin, adjustInventory);

// CSV
router.route('/products/export').get(protect, admin, exportProductsCSV);

export default router;
