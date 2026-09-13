import User from '../models/User.js';
import Notification from '../models/Notification.js';
import SupportTicket from '../models/SupportTicket.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js'; // Assuming Wishlist is an array of Product IDs on User model
import Wishlist from '../models/Wishlist.js';

// @desc    Get Dashboard Stats
// @route   GET /api/customer/stats
// @access  Private
export const getDashboardStats = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).lean();
    
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Confirmed').length;
    const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
    
    const wishlist = await Wishlist.findOne({ user: req.user._id }).lean();
    const wishlistCount = wishlist ? wishlist.items.length : 0;
    
    const recentOrders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        deliveredOrders,
        wishlistCount,
        recentOrders
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Profile
// @route   GET /api/customer/profile
// @access  Private
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Profile
// @route   PUT /api/customer/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.name = req.body.name || user.name;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
    user.profilePicture = req.body.profilePicture || user.profilePicture;
    
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        profilePicture: updatedUser.profilePicture,
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Addresses
// @route   GET /api/customer/addresses
// @access  Private
export const getAddresses = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, data: user.addresses || [] });
  } catch (error) {
    next(error);
  }
};

// @desc    Add Address
// @route   POST /api/customer/addresses
// @access  Private
export const addAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (req.body.isDefault) {
      user.addresses.forEach(a => a.isDefault = false);
    }
    
    if (user.addresses.length === 0) {
      req.body.isDefault = true;
    }

    user.addresses.push(req.body);
    await user.save();
    
    res.json({ success: true, data: user.addresses });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Address
// @route   PUT /api/customer/addresses/:id
// @access  Private
export const updateAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (req.body.isDefault) {
      user.addresses.forEach(a => a.isDefault = false);
    }

    const address = user.addresses.id(req.params.id);
    if (!address) {
      res.status(404);
      throw new Error('Address not found');
    }

    Object.assign(address, req.body);
    await user.save();
    
    res.json({ success: true, data: user.addresses });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Address
// @route   DELETE /api/customer/addresses/:id
// @access  Private
export const deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses.pull(req.params.id);
    await user.save();
    res.json({ success: true, data: user.addresses });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Notifications
// @route   GET /api/customer/notifications
// @access  Private
export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: notifications });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark Notification Read
// @route   PUT /api/customer/notifications/:id/read
// @access  Private
export const markNotificationRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOne({ _id: req.params.id, user: req.user._id });
    if (!notification) {
      res.status(404);
      throw new Error('Notification not found');
    }
    notification.isRead = true;
    await notification.save();
    res.json({ success: true, data: notification });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Notification
// @route   DELETE /api/customer/notifications/:id
// @access  Private
export const deleteNotification = async (req, res, next) => {
  try {
    await Notification.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Create Support Ticket
// @route   POST /api/customer/support
// @access  Private
export const createSupportTicket = async (req, res, next) => {
  try {
    const ticket = await SupportTicket.create({
      user: req.user._id,
      subject: req.body.subject,
      message: req.body.message,
      history: [{ message: req.body.message }]
    });
    res.status(201).json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Support Tickets
// @route   GET /api/customer/support
// @access  Private
export const getSupportTickets = async (req, res, next) => {
  try {
    const tickets = await SupportTicket.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: tickets });
  } catch (error) {
    next(error);
  }
};
