import express from 'express';
import { handleChat } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20, // 20 requests per 15 minutes per IP
  message: { success: false, message: 'Too many requests to the AI Assistant. Please try again later.' }
});

// We make this route optional for authentication so both guests and users can use it
// But we use a custom middleware to set req.user if token exists without throwing error if it doesn't
const optionalAuth = (req, res, next) => {
  // If we want to strictly protect it, we use `protect`.
  // The requirements say: "Allow logged-in users to track orders. If not logged in: 'Please log in to view your orders.'"
  // We'll apply `protect` wrapped in a try/catch or just extract token manually
  // Actually, we can just use the standard protect but handle it gracefully, or let the frontend decide.
  // Wait, let's just create an optional middleware.
  next(); // We will rely on req.user being populated if a token is present, but let's implement a real optional auth.
};

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const optionalProtect = async (req, res, next) => {
  let token;
  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select('-password');
    } catch (error) {
      // Token invalid or expired, just proceed as guest
    }
  }
  next();
};


router.post('/chat', aiLimiter, optionalProtect, handleChat);

export default router;
