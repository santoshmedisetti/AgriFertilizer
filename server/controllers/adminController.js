import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Inventory from '../models/Inventory.js';

// Helper to get date thresholds
const getDaysAgo = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(0,0,0,0);
  return d;
};
const getMonthsAgo = (months) => {
  const d = new Date();
  d.setMonth(d.getMonth() - months);
  d.setDate(1);
  d.setHours(0,0,0,0);
  return d;
};
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// @desc    Overview Analytics
export const getOverviewAnalytics = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0,0,0,0);

    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    
    const revenueAgg = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    const todayRevenueAgg = await Order.aggregate([
      { $match: { isPaid: true, createdAt: { $gte: today } } },
      { $group: { _id: null, todayRevenue: { $sum: '$totalPrice' } } }
    ]);
    const todayRevenue = todayRevenueAgg[0]?.todayRevenue || 0;

    const pendingOrders = await Order.countDocuments({ status: { $in: ['Pending', 'Confirmed'] } });
    const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });
    const cancelledOrders = await Order.countDocuments({ status: 'Cancelled' });
    
    const lowStockProducts = await Inventory.countDocuments({ stockStatus: 'Low Stock' });

    const recentOrders = await Order.find({}).populate('user', 'name').sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      data: {
        totalOrders, totalProducts, totalCustomers, totalRevenue, todayRevenue,
        pendingOrders, deliveredOrders, cancelledOrders, lowStockProducts,
        recentOrders
      }
    });
  } catch (error) { next(error); }
};

// @desc    Revenue Analytics
export const getRevenueAnalytics = async (req, res, next) => {
  try {
    // Daily (Last 30 Days)
    const dailyData = await Order.aggregate([
      { $match: { createdAt: { $gte: getDaysAgo(30) }, isPaid: true } },
      { $group: { _id: { day: { $dayOfMonth: '$createdAt' }, month: { $month: '$createdAt' } }, revenue: { $sum: '$totalPrice' } } },
      { $sort: { '_id.month': 1, '_id.day': 1 } }
    ]);
    const daily = dailyData.map(d => ({ name: `${d._id.day} ${monthNames[d._id.month - 1]}`, revenue: d.revenue }));

    // Monthly (Last 12 Months)
    const monthlyData = await Order.aggregate([
      { $match: { createdAt: { $gte: getMonthsAgo(12) }, isPaid: true } },
      { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, revenue: { $sum: '$totalPrice' } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    const monthly = monthlyData.map(d => ({ name: `${monthNames[d._id.month - 1]} ${d._id.year}`, revenue: d.revenue }));

    // Yearly
    const yearlyData = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: { year: { $year: '$createdAt' } }, revenue: { $sum: '$totalPrice' } } },
      { $sort: { '_id.year': 1 } }
    ]);
    const yearly = yearlyData.map(d => ({ name: `${d._id.year}`, revenue: d.revenue }));

    res.json({ success: true, data: { daily, monthly, yearly } });
  } catch (error) { next(error); }
};

// @desc    Order Analytics
export const getOrderAnalytics = async (req, res, next) => {
  try {
    const statusData = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const byStatus = statusData.map(d => ({ name: d._id, value: d.count }));

    const monthlyData = await Order.aggregate([
      { $match: { createdAt: { $gte: getMonthsAgo(6) } } },
      { $group: { _id: { month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id.month': 1 } }
    ]);
    const byMonth = monthlyData.map(d => ({ name: monthNames[d._id.month - 1], count: d.count }));

    res.json({ success: true, data: { byStatus, byMonth } });
  } catch (error) { next(error); }
};

// @desc    Product Analytics
export const getProductAnalytics = async (req, res, next) => {
  try {
    const productStats = await Order.aggregate([
      { $unwind: '$orderItems' },
      { $group: { _id: '$orderItems.name', totalSold: { $sum: '$orderItems.qty' }, revenue: { $sum: { $multiply: ['$orderItems.qty', '$orderItems.price'] } } } },
      { $sort: { totalSold: -1 } }
    ]);

    const bestSellers = productStats.slice(0, 10).map(d => ({ name: d._id, sold: d.totalSold, revenue: d.revenue }));
    const leastSelling = [...productStats].reverse().slice(0, 10).map(d => ({ name: d._id, sold: d.totalSold, revenue: d.revenue }));

    const categoryStats = await Order.aggregate([
      { $unwind: '$orderItems' },
      { $lookup: { from: 'products', localField: 'orderItems.product', foreignField: '_id', as: 'pInfo' } },
      { $unwind: '$pInfo' },
      { $lookup: { from: 'categories', localField: 'pInfo.category', foreignField: '_id', as: 'cInfo' } },
      { $unwind: '$cInfo' },
      { $group: { _id: '$cInfo.name', value: { $sum: '$orderItems.qty' } } }
    ]);
    const topCategories = categoryStats.map(d => ({ name: d._id, value: d.value }));

    res.json({ success: true, data: { bestSellers, leastSelling, topCategories } });
  } catch (error) { next(error); }
};

// @desc    Inventory Analytics
export const getInventoryAnalytics = async (req, res, next) => {
  try {
    const statusData = await Inventory.aggregate([
      { $group: { _id: '$stockStatus', count: { $sum: 1 } } }
    ]);
    const stockDistribution = statusData.map(d => ({ name: d._id, value: d.count }));
    res.json({ success: true, data: { stockDistribution } });
  } catch (error) { next(error); }
};

// @desc    Customer Analytics
export const getCustomerAnalytics = async (req, res, next) => {
  try {
    const thirtyDaysAgo = getDaysAgo(30);
    const newCustomers = await User.countDocuments({ role: 'customer', createdAt: { $gte: thirtyDaysAgo } });
    const oldCustomers = await User.countDocuments({ role: 'customer', createdAt: { $lt: thirtyDaysAgo } });
    
    const activeVsNew = [
      { name: 'New Customers (Last 30 Days)', value: newCustomers },
      { name: 'Returning Customers', value: oldCustomers }
    ];

    const growthData = await User.aggregate([
      { $match: { role: 'customer', createdAt: { $gte: getMonthsAgo(6) } } },
      { $group: { _id: { month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id.month': 1 } }
    ]);
    const customerGrowth = growthData.map(d => ({ name: monthNames[d._id.month - 1], count: d.count }));

    res.json({ success: true, data: { activeVsNew, customerGrowth } });
  } catch (error) { next(error); }
};

// @desc    Generate Reports
export const getReports = async (req, res, next) => {
  try {
    const { type } = req.query; // 'sales', 'inventory', 'customers'
    let reportData = [];

    if (type === 'sales') {
      const orders = await Order.find({}).populate('user', 'name email').lean();
      reportData = orders.map(o => ({
        OrderNumber: o.orderNumber || o._id.toString(),
        Date: new Date(o.createdAt).toLocaleDateString(),
        CustomerName: o.user?.name || 'Guest',
        CustomerEmail: o.user?.email || 'N/A',
        ItemsCount: o.orderItems.length,
        TotalAmount: o.totalPrice,
        Status: o.status,
        PaymentMethod: o.paymentMethod,
        IsPaid: o.isPaid ? 'Yes' : 'No'
      }));
    } else if (type === 'inventory') {
      const invs = await Inventory.find({}).populate('productId', 'name price').lean();
      reportData = invs.map(i => ({
        ProductName: i.productId?.name || 'Unknown',
        Price: i.productId?.price || 0,
        CurrentStock: i.currentStock,
        MinimumStock: i.minimumStock,
        Status: i.stockStatus,
        LastUpdated: new Date(i.lastUpdated).toLocaleDateString()
      }));
    } else if (type === 'customers') {
      const users = await User.find({ role: 'customer' }).lean();
      reportData = users.map(u => ({
        Name: u.name,
        Email: u.email,
        Phone: u.phoneNumber || 'N/A',
        JoinedDate: new Date(u.createdAt).toLocaleDateString(),
        Status: u.isBlocked ? 'Blocked' : 'Active'
      }));
    }

    res.json({ success: true, data: reportData });
  } catch (error) { next(error); }
};
