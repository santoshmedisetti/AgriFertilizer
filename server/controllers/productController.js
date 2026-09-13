import Product from '../models/Product.js';

// @desc    Fetch all products with filtering, sorting, pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const pageSize = Number(req.query.pageSize) || 12;
    const page = Number(req.query.pageNumber) || 1;

    // Search keyword
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: 'i' } }
      : {};

    // Filters
    const category = req.query.category ? { category: req.query.category } : {};
    const brand = req.query.brand ? { brand: req.query.brand } : {};
    
    // Price range
    const priceFilter = {};
    if (req.query.minPrice || req.query.maxPrice) {
      priceFilter.price = {};
      if (req.query.minPrice) priceFilter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) priceFilter.price.$lte = Number(req.query.maxPrice);
    }

    // Combine all filters
    const filter = { ...keyword, ...category, ...brand, ...priceFilter, isActive: true };

    // Sorting
    let sortObj = { createdAt: -1 };
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price_asc': sortObj = { price: 1 }; break;
        case 'price_desc': sortObj = { price: -1 }; break;
        case 'rating_desc': sortObj = { rating: -1 }; break;
        case 'newest': sortObj = { createdAt: -1 }; break;
      }
    }

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .populate('brand', 'name slug')
      .sort(sortObj)
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .lean();

    res.json({
      success: true,
      data: {
        products,
        page,
        pages: Math.ceil(count / pageSize),
        total: count
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('brand', 'name slug');

    if (product) {
      res.json({ success: true, data: product });
    } else {
      const err = new Error('Product not found');
      err.status = 404;
      return next(err);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const {
      name, sku, price, discountPrice, description, images, brand, category,
      countInStock, unit, npkRatio, benefits, usageInstructions, manufacturer,
      expiryDate, isFeatured, isBestSeller
    } = req.body;

    const productExists = await Product.findOne({ sku });
    if (productExists) {
      const err = new Error('Product with this SKU already exists');
      err.status = 400;
      return next(err);
    }

    const product = new Product({
      name, sku, price, discountPrice, description, images, brand, category,
      countInStock, unit, npkRatio, benefits, usageInstructions, manufacturer,
      expiryDate, isFeatured, isBestSeller, user: req.user._id,
    });

    const createdProduct = await product.save();
    res.status(201).json({ success: true, data: createdProduct });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      const fields = [
        'name', 'sku', 'price', 'discountPrice', 'description', 'images', 'brand', 'category',
        'countInStock', 'unit', 'npkRatio', 'benefits', 'usageInstructions', 'manufacturer',
        'expiryDate', 'isFeatured', 'isBestSeller', 'isActive'
      ];
      
      fields.forEach(field => {
        if (req.body[field] !== undefined) {
          product[field] = req.body[field];
        }
      });

      const updatedProduct = await product.save();
      res.json({ success: true, data: updatedProduct });
    } else {
      const err = new Error('Product not found');
      err.status = 404;
      return next(err);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ success: true, message: 'Product removed' });
    } else {
      const err = new Error('Product not found');
      err.status = 404;
      return next(err);
    }
  } catch (error) {
    next(error);
  }
};
