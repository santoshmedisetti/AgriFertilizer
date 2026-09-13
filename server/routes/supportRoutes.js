import express from 'express';
import { 
  createTicket,
  getMyTickets,
  replyToTicket
} from '../controllers/supportController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createTicket)
  .get(protect, getMyTickets);

router.route('/:id/reply')
  .post(protect, replyToTicket);

export default router;
