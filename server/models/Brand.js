import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
      default: 'https://via.placeholder.com/400',
    },
  },
  { timestamps: true }
);

const Brand = mongoose.model('Brand', brandSchema);
export default Brand;
