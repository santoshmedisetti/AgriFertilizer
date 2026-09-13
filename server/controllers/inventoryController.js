import Inventory from '../models/Inventory.js';
import StockTransaction from '../models/StockTransaction.js';
import Product from '../models/Product.js';

// Helper function to sync Product model
const syncProductStock = async (productId, currentStock) => {
  const product = await Product.findById(productId);
  if (product) {
    product.countInStock = currentStock;
    await product.save();
  }
};

// @desc    Get Inventory Overview
// @route   GET /api/inventory
// @access  Private/Admin
export const getInventoryOverview = async (req, res, next) => {
  try {
    const { keyword = '', status } = req.query;

    const query = {};
    if (status) {
      query.stockStatus = status;
    }

    // Populate product to allow search by name/sku
    let inventories = await Inventory.find(query).populate('productId', 'name sku image price brand category').lean();

    if (keyword) {
      inventories = inventories.filter(inv => 
        inv.productId && (
          inv.productId.name.toLowerCase().includes(keyword.toLowerCase()) || 
          inv.productId.sku.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    }

    const totalProducts = inventories.length;
    const inStock = inventories.filter(i => i.stockStatus === 'In Stock').length;
    const lowStock = inventories.filter(i => i.stockStatus === 'Low Stock').length;
    const outOfStock = inventories.filter(i => i.stockStatus === 'Out of Stock').length;
    const totalQuantity = inventories.reduce((acc, curr) => acc + curr.currentStock, 0);

    res.json({
      success: true,
      data: {
        inventories,
        metrics: { totalProducts, inStock, lowStock, outOfStock, totalQuantity }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Inventory by Product ID
// @route   GET /api/inventory/:productId
// @access  Private/Admin
export const getInventoryByProduct = async (req, res, next) => {
  try {
    const inventory = await Inventory.findOne({ productId: req.params.productId }).populate('productId', 'name sku image');
    if (!inventory) {
      const err = new Error('Inventory record not found');
      err.status = 404;
      return next(err);
    }
    res.json({ success: true, data: inventory });
  } catch (error) {
    next(error);
  }
};

// @desc    Stock In
// @route   POST /api/inventory/stock-in
// @access  Private/Admin
export const stockIn = async (req, res, next) => {
  try {
    const { productId, quantity, reason, notes } = req.body;
    
    let inventory = await Inventory.findOne({ productId });
    if (!inventory) {
      inventory = new Inventory({ productId, currentStock: 0 });
    }

    inventory.currentStock += Number(quantity);
    await inventory.save();

    await StockTransaction.create({
      product: productId,
      quantity: Number(quantity),
      transactionType: 'Stock In',
      reason,
      admin: req.user._id,
      notes
    });

    await syncProductStock(productId, inventory.currentStock);

    res.json({ success: true, data: inventory });
  } catch (error) {
    next(error);
  }
};

// @desc    Stock Out
// @route   POST /api/inventory/stock-out
// @access  Private/Admin
export const stockOut = async (req, res, next) => {
  try {
    const { productId, quantity, reason, notes } = req.body;
    
    let inventory = await Inventory.findOne({ productId });
    if (!inventory) {
      const err = new Error('Inventory record not found');
      err.status = 404;
      return next(err);
    }

    if (inventory.currentStock < Number(quantity)) {
      const err = new Error('Insufficient stock');
      err.status = 400;
      return next(err);
    }

    inventory.currentStock -= Number(quantity);
    await inventory.save();

    await StockTransaction.create({
      product: productId,
      quantity: Number(quantity),
      transactionType: reason === 'Damaged Stock' ? 'Damaged Stock' : 'Stock Out',
      reason,
      admin: req.user._id,
      notes
    });

    await syncProductStock(productId, inventory.currentStock);

    res.json({ success: true, data: inventory });
  } catch (error) {
    next(error);
  }
};

// @desc    Adjust Stock
// @route   POST /api/inventory/adjust
// @access  Private/Admin
export const adjustStock = async (req, res, next) => {
  try {
    const { productId, quantity, reason, notes } = req.body;
    
    let inventory = await Inventory.findOne({ productId });
    if (!inventory) {
      inventory = new Inventory({ productId, currentStock: 0 });
    }

    const difference = Number(quantity) - inventory.currentStock;
    inventory.currentStock = Number(quantity);
    await inventory.save();

    await StockTransaction.create({
      product: productId,
      quantity: Math.abs(difference),
      transactionType: 'Manual Adjustment',
      reason,
      admin: req.user._id,
      notes: notes || `Adjusted by ${difference}`
    });

    await syncProductStock(productId, inventory.currentStock);

    res.json({ success: true, data: inventory });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Inventory History
// @route   GET /api/inventory/history
// @access  Private/Admin
export const getInventoryHistory = async (req, res, next) => {
  try {
    const history = await StockTransaction.find({})
      .populate('product', 'name sku')
      .populate('admin', 'name')
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
};
