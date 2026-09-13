import User from '../models/User.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.role = req.body.role || user.role;
      const updatedUser = await user.save();

      res.json({
        success: true,
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
        }
      });
    } else {
      const err = new Error('User not found');
      err.status = 404;
      return next(err);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Block / Unblock user
// @route   PUT /api/users/:id/block
// @access  Private/Admin
export const blockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      if (user.role === 'admin') {
        const err = new Error('Cannot block an admin');
        err.status = 400;
        return next(err);
      }
      user.isBlocked = !user.isBlocked;
      const updatedUser = await user.save();

      res.json({
        success: true,
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          isBlocked: updatedUser.isBlocked,
        }
      });
    } else {
      const err = new Error('User not found');
      err.status = 404;
      return next(err);
    }
  } catch (error) {
    next(error);
  }
};
