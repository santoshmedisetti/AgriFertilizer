import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// Helper to get or create cart
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req, res, next) => {
  try {
    const { productId, qty } = req.body;
    
    // Validate stock
    const product = await Product.findById(productId);
    if (!product) {
      const err = new Error('Product not found');
      err.status = 404;
      return next(err);
    }
    if (product.countInStock < qty) {
      const err = new Error('Not enough stock available');
      err.status = 400;
      return next(err);
    }

    const cart = await getOrCreateCart(req.user._id);

    // Check if item already in cart
    const existingItem = cart.items.find(item => item.product.toString() === productId);

    if (existingItem) {
      // Update quantity but respect stock
      if (existingItem.qty + qty > product.countInStock) {
        const err = new Error('Cannot exceed available stock');
        err.status = 400;
        return next(err);
      }
      existingItem.qty += Number(qty);
    } else {
      // Add new item
      cart.items.push({
        product: product._id,
        name: product.name,
        image: product.images[0],
        price: product.price,
        discountPrice: product.discountPrice,
        qty: Number(qty),
        countInStock: product.countInStock,
      });
    }

    await cart.save();
    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:id
// @access  Private
export const updateCartItem = async (req, res, next) => {
  try {
    const { qty } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      const err = new Error('Cart not found');
      err.status = 404;
      return next(err);
    }

    const item = cart.items.find(item => item._id.toString() === req.params.id || item.product.toString() === req.params.id);
    if (!item) {
      const err = new Error('Item not found in cart');
      err.status = 404;
      return next(err);
    }

    if (qty > item.countInStock) {
      const err = new Error('Cannot exceed available stock');
      err.status = 400;
      return next(err);
    }

    item.qty = Number(qty);
    await cart.save();

    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Private
export const removeCartItem = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      const err = new Error('Cart not found');
      err.status = 404;
      return next(err);
    }

    cart.items = cart.items.filter(item => item._id.toString() !== req.params.id && item.product.toString() !== req.params.id);
    await cart.save();

    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.json({ success: true, message: 'Cart cleared', data: cart });
  } catch (error) {
    next(error);
  }
};
