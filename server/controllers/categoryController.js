import Category from '../models/Category.js';
import slugify from 'slugify';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res, next) => {
  try {
    const { name, description, image } = req.body;
    
    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      const err = new Error('Category already exists');
      err.status = 400;
      return next(err);
    }

    const category = await Category.create({
      name,
      slug: slugify(name, { lower: true, strict: true }),
      description,
      image,
    });

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res, next) => {
  try {
    const { name, description, image } = req.body;
    const category = await Category.findById(req.params.id);

    if (category) {
      category.name = name || category.name;
      if (name) category.slug = slugify(name, { lower: true, strict: true });
      category.description = description || category.description;
      category.image = image || category.image;

      const updatedCategory = await category.save();
      res.json({ success: true, data: updatedCategory });
    } else {
      const err = new Error('Category not found');
      err.status = 404;
      return next(err);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (category) {
      await Category.deleteOne({ _id: category._id });
      res.json({ success: true, message: 'Category removed' });
    } else {
      const err = new Error('Category not found');
      err.status = 404;
      return next(err);
    }
  } catch (error) {
    next(error);
  }
};
