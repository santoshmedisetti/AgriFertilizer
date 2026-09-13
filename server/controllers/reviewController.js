import Review from '../models/Review.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

// Helper to update Product's average rating
const updateProductRating = async (productId) => {
  const reviews = await Review.find({ productId, status: 'Approved', isDeleted: false });
  const numReviews = reviews.length;
  const rating = numReviews === 0 
    ? 0 
    : reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews;

  await Product.findByIdAndUpdate(productId, {
    rating: Number(rating.toFixed(1)),
    numReviews
  });
};

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res, next) => {
  try {
    const { productId, rating, title, comment, images } = req.body;

    // Check if user actually ordered and received the product (find latest delivered order)
    const order = await Order.findOne({ 
      user: req.user._id,
      status: 'Delivered',
      'orderItems.product': productId
    }).sort({ createdAt: -1 });

    if (!order) {
      res.status(400);
      throw new Error('You can only review products that have been delivered to you.');
    }

    // Check if review already exists for this order+product combination
    const existingReview = await Review.findOne({
      productId,
      userId: req.user._id,
      orderId: order._id,
      isDeleted: false
    });

    if (existingReview) {
      res.status(400);
      throw new Error('You have already reviewed this product from your recent order.');
    }

    const review = await Review.create({
      productId,
      userId: req.user._id,
      orderId: order._id,
      rating: Number(rating),
      title,
      comment,
      images: images || [],
      verifiedPurchase: true,
      status: 'Approved', // per plan default
    });

    await updateProductRating(productId);

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getProductReviews = async (req, res, next) => {
  try {
    const sortBy = req.query.sort || 'latest';
    let sortObj = { createdAt: -1 };
    
    if (sortBy === 'highest') sortObj = { rating: -1 };
    if (sortBy === 'lowest') sortObj = { rating: 1 };
    if (sortBy === 'helpful') sortObj = { helpfulCount: -1 };

    const reviews = await Review.find({ 
      productId: req.params.productId, 
      status: 'Approved',
      isDeleted: false 
    })
    .populate('userId', 'name profilePicture')
    .sort(sortObj);

    res.json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req, res, next) => {
  try {
    const review = await Review.findOne({ _id: req.params.id, userId: req.user._id, isDeleted: false });
    if (!review) {
      res.status(404);
      throw new Error('Review not found');
    }

    // Check if within 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    if (review.createdAt < sevenDaysAgo) {
      res.status(400);
      throw new Error('Reviews can only be edited within 7 days of posting');
    }

    review.rating = req.body.rating || review.rating;
    review.title = req.body.title || review.title;
    review.comment = req.body.comment || review.comment;
    if (req.body.images) review.images = req.body.images;

    await review.save();
    
    if (review.status === 'Approved') {
      await updateProductRating(review.productId);
    }

    res.json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a review (soft delete)
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findOne({ _id: req.params.id, userId: req.user._id });
    if (!review) {
      res.status(404);
      throw new Error('Review not found');
    }

    review.isDeleted = true;
    await review.save();
    
    await updateProductRating(review.productId);

    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark review as helpful
// @route   POST /api/reviews/:id/helpful
// @access  Private
export const markHelpful = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review || review.isDeleted) {
      res.status(404);
      throw new Error('Review not found');
    }

    if (review.helpfulUsers.includes(req.user._id)) {
      res.status(400);
      throw new Error('You already marked this as helpful');
    }

    review.helpfulUsers.push(req.user._id);
    review.helpfulCount += 1;
    await review.save();

    res.json({ success: true, message: 'Marked as helpful' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all my reviews (Customer Dashboard)
// @route   GET /api/reviews/my
// @access  Private
export const getMyReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ userId: req.user._id, isDeleted: false })
      .populate('productId', 'name images')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// ADMIN ENDPOINTS
// ==========================================

// @desc    Get all reviews for moderation
// @route   GET /api/admin/reviews
// @access  Private/Admin
export const getAdminReviews = async (req, res, next) => {
  try {
    const status = req.query.status || '';
    let filter = { isDeleted: false };
    if (status) filter.status = status;

    const reviews = await Review.find(filter)
      .populate('productId', 'name images')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
};

// @desc    Update review status (Approve/Reject)
// @route   PUT /api/admin/reviews/:id/status
// @access  Private/Admin
export const updateReviewStatus = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      res.status(404);
      throw new Error('Review not found');
    }

    review.status = req.body.status;
    await review.save();
    
    await updateProductRating(review.productId);

    res.json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};
