import Coupon from '../models/Coupon.js';

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
export const getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: coupons });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single coupon
// @route   GET /api/coupons/:id
// @access  Private/Admin
export const getCouponById = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (coupon) {
      res.json({ success: true, data: coupon });
    } else {
      res.status(404);
      throw new Error('Coupon not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a coupon
// @route   POST /api/coupons
// @access  Private/Admin
export const createCoupon = async (req, res, next) => {
  try {
    const coupon = new Coupon(req.body);
    const createdCoupon = await coupon.save();
    res.status(201).json({ success: true, data: createdCoupon });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
export const updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (coupon) {
      Object.assign(coupon, req.body);
      const updatedCoupon = await coupon.save();
      res.json({ success: true, data: updatedCoupon });
    } else {
      res.status(404);
      throw new Error('Coupon not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
export const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (coupon) {
      await Coupon.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: 'Coupon removed' });
    } else {
      res.status(404);
      throw new Error('Coupon not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Apply a coupon
// @route   POST /api/coupons/apply
// @access  Private
export const applyCoupon = async (req, res, next) => {
  try {
    const { code, orderAmount } = req.body;
    
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      res.status(404);
      throw new Error('Invalid coupon code');
    }

    if (coupon.status !== 'Active') {
      res.status(400);
      throw new Error(`Coupon is ${coupon.status.toLowerCase()}`);
    }

    if (coupon.startDate > Date.now()) {
      res.status(400);
      throw new Error('Coupon is not yet valid');
    }

    if (coupon.expiryDate < Date.now()) {
      coupon.status = 'Expired';
      await coupon.save();
      res.status(400);
      throw new Error('Coupon has expired');
    }

    if (coupon.usageLimit !== null && coupon.totalUsed >= coupon.usageLimit) {
      coupon.status = 'Expired';
      await coupon.save();
      res.status(400);
      throw new Error('Coupon usage limit reached');
    }

    const userUsage = coupon.usedBy.find(u => u.user.toString() === req.user._id.toString());
    if (userUsage && userUsage.count >= coupon.usagePerUser) {
      res.status(400);
      throw new Error('You have already reached the usage limit for this coupon');
    }

    if (orderAmount < coupon.minimumOrderAmount) {
      res.status(400);
      throw new Error(`Minimum order amount of ₹${coupon.minimumOrderAmount} required`);
    }

    let discountAmount = 0;
    if (coupon.discountType === 'fixed') {
      discountAmount = coupon.discountValue;
    } else if (coupon.discountType === 'percentage') {
      discountAmount = (orderAmount * coupon.discountValue) / 100;
      if (coupon.maximumDiscount && discountAmount > coupon.maximumDiscount) {
        discountAmount = coupon.maximumDiscount;
      }
    }

    // Ensure discount does not exceed order amount
    discountAmount = Math.min(discountAmount, orderAmount);

    res.json({
      success: true,
      data: {
        code: coupon.code,
        discountAmount,
        message: 'Coupon applied successfully',
      }
    });
  } catch (error) {
    next(error);
  }
};
