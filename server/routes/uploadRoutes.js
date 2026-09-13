import express from 'express';
import upload from '../middleware/uploadMiddleware.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, admin, upload.single('image'), (req, res, next) => {
  if (req.file) {
    res.json({ success: true, url: req.file.path });
  } else {
    const err = new Error('No image uploaded');
    err.status = 400;
    next(err);
  }
});

export default router;
