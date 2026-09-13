import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
      required: true,
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
      index: true,
    },
    unit: {
      type: String,
      required: true, // e.g., 'kg', 'litre', 'bag'
    },
    npkRatio: {
      type: String, // e.g., '19-19-19'
    },
    description: {
      type: String,
      required: true,
    },
    benefits: {
      type: [String],
    },
    usageInstructions: {
      type: String,
    },
    manufacturer: {
      type: String,
    },
    expiryDate: {
      type: Date,
    },
    images: {
      type: [String],
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    expiryDate: {
      type: Date,
    },
    minimumStockLevel: {
      type: Number,
      default: 10,
    }
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
