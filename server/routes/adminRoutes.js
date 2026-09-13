import express from 'express';
import { 
  getOverviewAnalytics,
  getRevenueAnalytics,
  getOrderAnalytics,
  getProductAnalytics,
  getInventoryAnalytics,
  getCustomerAnalytics,
  getReports
} from '../controllers/adminController.js';
import { getAdminReviews, updateReviewStatus } from '../controllers/reviewController.js';
import { getAllTickets, updateTicketStatus } from '../controllers/supportController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, admin);

router.route('/analytics/overview').get(getOverviewAnalytics);
router.route('/analytics/revenue').get(getRevenueAnalytics);
router.route('/analytics/orders').get(getOrderAnalytics);
router.route('/analytics/products').get(getProductAnalytics);
router.route('/analytics/inventory').get(getInventoryAnalytics);
router.route('/analytics/customers').get(getCustomerAnalytics);
router.route('/analytics/reports').get(getReports);

router.route('/reviews').get(getAdminReviews);
router.route('/reviews/:id/status').put(updateReviewStatus);

router.route('/support').get(getAllTickets);
router.route('/support/:id/status').put(updateTicketStatus);

export default router;
