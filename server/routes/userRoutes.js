import express from 'express';
import rateLimit from 'express-rate-limit';
import { addAddress, deleteAddress } from '../controllers/userAddressController.js';
import { getUsers, updateUserRole, blockUser } from '../controllers/userController.js';
import { registerUser, loginUser, logoutUser } from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // limit each IP to 10 requests per windowMs for auth routes
  message: { success: false, message: 'Too many authentication attempts, please try again later.' }
});

router.route('/').post(authLimiter, registerUser).get(protect, admin, getUsers);
router.route('/login').post(authLimiter, loginUser);
router.post('/logout', logoutUser);
router.route('/:id/role').put(protect, admin, updateUserRole);
router.route('/:id/block').put(protect, admin, blockUser);

router.route('/profile/addresses').post(protect, addAddress);
router.route('/profile/addresses/:id').delete(protect, deleteAddress);

export default router;
