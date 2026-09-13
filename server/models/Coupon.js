import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    minimumOrderAmount: {
      type: Number,
      default: 0,
    },
    maximumDiscount: {
      type: Number,
      default: null, // Useful for percentage caps
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      required: true,
      index: true,
    },
    usageLimit: {
      type: Number,
      default: null, // Total times this coupon can be used
    },
    usagePerUser: {
      type: Number,
      default: 1,
    },
    totalUsed: {
      type: Number,
      default: 0,
    },
    usedBy: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        count: { type: Number, default: 0 },
      }
    ],
    applicableCategories: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
    ],
    applicableProducts: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
    ],
    status: {
      type: String,
      enum: ['Active', 'Expired', 'Disabled'],
      default: 'Active',
      index: true,
    },
  },
  { timestamps: true }
);

// Auto expire middleware
couponSchema.pre('save', function (next) {
  if (this.expiryDate < Date.now() && this.status !== 'Disabled') {
    this.status = 'Expired';
  }
  if (this.usageLimit !== null && this.totalUsed >= this.usageLimit && this.status !== 'Disabled') {
    this.status = 'Expired';
  }
  next();
});

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;
