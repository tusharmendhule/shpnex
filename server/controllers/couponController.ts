import { Request, Response } from 'express';
import { isDbConnected, localDb } from '../config/db.js';
import { CouponModel } from '../models/schemas.js';

// @desc    Get all coupons (Admin only)
// @route   GET /api/coupons
// @access  Private/Admin
export async function getCoupons(req: Request, res: Response) {
  try {
    if (isDbConnected()) {
      const coupons = await CouponModel.find({});
      res.json({ success: true, coupons });
    } else {
      res.json({ success: true, coupons: localDb.coupons });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// @desc    Validate/Apply a coupon
// @route   POST /api/coupons/validate
// @access  Private
export async function validateCoupon(req: Request, res: Response) {
  const { code } = req.body;

  if (!code) {
    res.status(400).json({ success: false, message: 'Coupon code is required' });
    return;
  }

  try {
    if (isDbConnected()) {
      const coupon = await CouponModel.findOne({ code: code.toUpperCase(), active: true });
      if (!coupon) {
        res.status(404).json({ success: false, message: 'Invalid coupon code' });
        return;
      }

      const expiry = new Date(coupon.expiryDate);
      if (expiry.getTime() < Date.now()) {
        res.status(400).json({ success: false, message: 'Coupon has expired' });
        return;
      }

      res.json({ success: true, coupon: { code: coupon.code, discount: coupon.discount } });
    } else {
      const coupon = localDb.coupons.find(
        (c) => c.code.toUpperCase() === code.toUpperCase() && c.active
      );

      if (!coupon) {
        res.status(404).json({ success: false, message: 'Invalid coupon code' });
        return;
      }

      const expiry = new Date(coupon.expiryDate);
      if (expiry.getTime() < Date.now()) {
        res.status(400).json({ success: false, message: 'Coupon has expired' });
        return;
      }

      res.json({ success: true, coupon: { code: coupon.code, discount: coupon.discount } });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// @desc    Create a coupon (Admin only)
// @route   POST /api/coupons
// @access  Private/Admin
export async function createCoupon(req: Request, res: Response) {
  const { code, discount, expiryDate } = req.body;

  if (!code || !discount || !expiryDate) {
    res.status(400).json({ success: false, message: 'Please provide code, discount, and expiry date' });
    return;
  }

  try {
    if (isDbConnected()) {
      const exists = await CouponModel.findOne({ code: code.toUpperCase() });
      if (exists) {
        res.status(400).json({ success: false, message: 'Coupon code already exists' });
        return;
      }

      const coupon = await CouponModel.create({
        code: code.toUpperCase(),
        discount: Number(discount),
        expiryDate: new Date(expiryDate),
        active: true,
      });

      res.status(201).json({ success: true, coupon });
    } else {
      const exists = localDb.coupons.some((c) => c.code.toUpperCase() === code.toUpperCase());
      if (exists) {
        res.status(400).json({ success: false, message: 'Coupon code already exists' });
        return;
      }

      const newCoupon = {
        id: 'coup_' + Math.random().toString(36).substr(2, 9),
        code: code.toUpperCase(),
        discount: Number(discount),
        expiryDate,
        active: true,
      };

      localDb.coupons.push(newCoupon);
      res.status(201).json({ success: true, coupon: newCoupon });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// @desc    Delete coupon (Admin only)
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
export async function deleteCoupon(req: Request, res: Response) {
  const { id } = req.params;

  try {
    if (isDbConnected()) {
      await CouponModel.findByIdAndDelete(id);
      res.json({ success: true, message: 'Coupon deleted successfully' });
    } else {
      const index = localDb.coupons.findIndex((c) => c.id === id);
      if (index === -1) {
        res.status(404).json({ success: false, message: 'Coupon not found' });
        return;
      }
      localDb.coupons.splice(index, 1);
      res.json({ success: true, message: 'Coupon deleted successfully' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
