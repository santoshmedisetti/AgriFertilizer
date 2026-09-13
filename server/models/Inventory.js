import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
      unique: true,
      index: true,
    },
    currentStock: {
      type: Number,
      required: true,
      default: 0,
    },
    minimumStock: {
      type: Number,
      required: true,
      default: 10,
    },
    reorderLevel: {
      type: Number,
      required: true,
      default: 50,
    },
    stockStatus: {
      type: String,
      enum: ['In Stock', 'Low Stock', 'Out of Stock'],
      default: 'Out of Stock',
    }
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to compute stockStatus automatically
inventorySchema.pre('save', function (next) {
  if (this.currentStock <= 0) {
    this.stockStatus = 'Out of Stock';
  } else if (this.currentStock <= this.minimumStock) {
    this.stockStatus = 'Low Stock';
  } else {
    this.stockStatus = 'In Stock';
  }
  next();
});

const Inventory = mongoose.model('Inventory', inventorySchema);

export default Inventory;
