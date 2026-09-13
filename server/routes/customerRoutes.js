import express from 'express';
import {
  getDashboardStats,
  getProfile,
  updateProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  getNotifications,
  markNotificationRead,
  deleteNotification,
  createSupportTicket,
  getSupportTickets
} from '../controllers/customerController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All routes are private

router.route('/stats').get(getDashboardStats);

router.route('/profile')
  .get(getProfile)
  .put(updateProfile);

router.route('/addresses')
  .get(getAddresses)
  .post(addAddress);

router.route('/addresses/:id')
  .put(updateAddress)
  .delete(deleteAddress);

router.route('/notifications')
  .get(getNotifications);
  
router.route('/notifications/:id')
  .delete(deleteNotification);
  
router.route('/notifications/:id/read')
  .put(markNotificationRead);

router.route('/support')
  .get(getSupportTickets)
  .post(createSupportTicket);

export default router;
