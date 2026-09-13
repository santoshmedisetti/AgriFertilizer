import User from '../models/User.js';

// @desc    Add a new address
// @route   POST /api/users/profile/addresses
// @access  Private
export const addAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      const { fullName, street, city, state, pinCode, phone, isDefault } = req.body;
      
      const newAddress = { fullName, street, city, state, pinCode, phone, isDefault };

      // If this is set to default, unset others
      if (isDefault) {
        user.addresses.forEach(addr => addr.isDefault = false);
      }
      
      // If it's the first address, make it default automatically
      if (user.addresses.length === 0) {
        newAddress.isDefault = true;
      }

      user.addresses.push(newAddress);
      await user.save();

      res.status(201).json({ success: true, data: user.addresses });
    } else {
      const err = new Error('User not found');
      err.status = 404;
      return next(err);
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an address
// @route   DELETE /api/users/profile/addresses/:id
// @access  Private
export const deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.id);
      
      // If we deleted the default address and there are others left, make the first one default
      if (user.addresses.length > 0 && !user.addresses.some(a => a.isDefault)) {
        user.addresses[0].isDefault = true;
      }

      await user.save();
      res.json({ success: true, data: user.addresses });
    } else {
      const err = new Error('User not found');
      err.status = 404;
      return next(err);
    }
  } catch (error) {
    next(error);
  }
};
