import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';

// Helper to get or create wishlist
const getOrCreateWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ user: userId }).populate('items');
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, items: [] });
  }
  return wishlist;
};

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req, res, next) => {
  try {
    const wishlist = await getOrCreateWishlist(req.user._id);
    res.json({ success: true, data: wishlist });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to wishlist
// @route   POST /api/wishlist
// @access  Private
export const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      const err = new Error('Product not found');
      err.status = 404;
      return next(err);
    }

    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      const newWishlist = await Wishlist.create({ user: req.user._id, items: [productId] });
      await newWishlist.populate('items');
      return res.status(201).json({ success: true, data: newWishlist });
    }

    // Check for duplicate
    if (wishlist.items.includes(productId)) {
      const err = new Error('Product already in wishlist');
      err.status = 400;
      return next(err);
    }

    wishlist.items.push(productId);
    await wishlist.save();
    await wishlist.populate('items');

    res.json({ success: true, data: wishlist });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
export const removeFromWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      const err = new Error('Wishlist not found');
      err.status = 404;
      return next(err);
    }

    wishlist.items = wishlist.items.filter(id => id.toString() !== req.params.productId);
    await wishlist.save();
    await wishlist.populate('items');

    res.json({ success: true, data: wishlist });
  } catch (error) {
    next(error);
  }
};
