import Brand from '../models/Brand.js';
import slugify from 'slugify';

// @desc    Get all brands
// @route   GET /api/brands
// @access  Public
export const getBrands = async (req, res, next) => {
  try {
    const brands = await Brand.find({}).sort({ name: 1 });
    res.json({ success: true, data: brands });
  } catch (error) {
    next(error);
  }
};

// @desc    Create brand
// @route   POST /api/brands
// @access  Private/Admin
export const createBrand = async (req, res, next) => {
  try {
    const { name, description, image } = req.body;
    
    const brandExists = await Brand.findOne({ name });
    if (brandExists) {
      const err = new Error('Brand already exists');
      err.status = 400;
      return next(err);
    }

    const brand = await Brand.create({
      name,
      slug: slugify(name, { lower: true, strict: true }),
      description,
      image,
    });

    res.status(201).json({ success: true, data: brand });
  } catch (error) {
    next(error);
  }
};

// @desc    Update brand
// @route   PUT /api/brands/:id
// @access  Private/Admin
export const updateBrand = async (req, res, next) => {
  try {
    const { name, description, image } = req.body;
    const brand = await Brand.findById(req.params.id);

    if (brand) {
      brand.name = name || brand.name;
      if (name) brand.slug = slugify(name, { lower: true, strict: true });
      brand.description = description || brand.description;
      brand.image = image || brand.image;

      const updatedBrand = await brand.save();
      res.json({ success: true, data: updatedBrand });
    } else {
      const err = new Error('Brand not found');
      err.status = 404;
      return next(err);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete brand
// @route   DELETE /api/brands/:id
// @access  Private/Admin
export const deleteBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findById(req.params.id);

    if (brand) {
      await Brand.deleteOne({ _id: brand._id });
      res.json({ success: true, message: 'Brand removed' });
    } else {
      const err = new Error('Brand not found');
      err.status = 404;
      return next(err);
    }
  } catch (error) {
    next(error);
  }
};
