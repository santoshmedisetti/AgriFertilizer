import mongoose from 'mongoose';

const stockTransactionSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
      index: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    transactionType: {
      type: String,
      enum: ['Stock In', 'Stock Out', 'Manual Adjustment', 'Damaged Stock', 'Returned Stock'],
      required: true,
      index: true,
    },
    reason: {
      type: String,
      required: true,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Optional because system (like order placements) can trigger this
    },
    notes: {
      type: String,
      default: '',
    }
  },
  {
    timestamps: true,
  }
);

const StockTransaction = mongoose.model('StockTransaction', stockTransactionSchema);

export default StockTransaction;
