import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      validate: [arrayLimit, '{PATH} exceeds the limit of 5'],
    },
    verifiedPurchase: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Approved', // Set default to Approved per plan discussion
      index: true,
    },
    helpfulCount: {
      type: Number,
      default: 0,
    },
    helpfulUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    isDeleted: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

function arrayLimit(val) {
  return val.length <= 5;
}

// Ensure a user can only review a product for a specific order once
reviewSchema.index({ productId: 1, userId: 1, orderId: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
