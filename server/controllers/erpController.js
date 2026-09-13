import Product from '../models/Product.js';
import InventoryHistory from '../models/InventoryHistory.js';
import Banner from '../models/Banner.js';

// @desc    Export products as CSV
// @route   GET /api/erp/products/export
// @access  Private/Admin
export const exportProductsCSV = async (req, res, next) => {
  try {
    const products = await Product.find({}).populate('category brand', 'name');
    
    const headers = 'ID,Name,SKU,Price,Stock,Category,Brand\n';
    const rows = products.map(p => {
      const catName = p.category ? p.category.name : '';
      const brandName = p.brand ? p.brand.name : '';
      return `${p._id},"${p.name}",${p.sku},${p.price},${p.countInStock},"${catName}","${brandName}"`;
    }).join('\n');

    res.header('Content-Type', 'text/csv');
    res.attachment('products_export.csv');
    return res.send(headers + rows);
  } catch (error) {
    next(error);
  }
};

// @desc    Adjust inventory
// @route   POST /api/erp/inventory/adjust
// @access  Private/Admin
export const adjustInventory = async (req, res, next) => {
  try {
    const { productId, quantity, type, reason } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) {
      const err = new Error('Product not found');
      err.status = 404;
      return next(err);
    }

    if (type === 'OUT' && product.countInStock < quantity) {
      const err = new Error('Insufficient stock for this adjustment');
      err.status = 400;
      return next(err);
    }

    if (type === 'IN') {
      product.countInStock += Number(quantity);
    } else if (type === 'OUT') {
      product.countInStock -= Number(quantity);
    } else if (type === 'ADJUSTMENT') {
      product.countInStock = Number(quantity);
    }

    await product.save();

    const historyRecord = await InventoryHistory.create({
      product: productId,
      type,
      quantity,
      reason,
      adminUser: req.user._id
    });

    res.json({ success: true, data: { product, historyRecord } });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all banners
// @route   GET /api/erp/banners
// @access  Public
export const getBanners = async (req, res, next) => {
  try {
    const banners = await Banner.find({}).sort({ position: 1 });
    res.json({ success: true, data: banners });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a banner
// @route   POST /api/erp/banners
// @access  Private/Admin
export const createBanner = async (req, res, next) => {
  try {
    const banner = await Banner.create(req.body);
    res.status(201).json({ success: true, data: banner });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a banner
// @route   DELETE /api/erp/banners/:id
// @access  Private/Admin
export const deleteBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (banner) {
      res.json({ success: true, message: 'Banner removed' });
    } else {
      const err = new Error('Banner not found');
      err.status = 404;
      return next(err);
    }
  } catch (error) {
    next(error);
  }
};
