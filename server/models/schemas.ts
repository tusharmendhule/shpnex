import mongoose, { Schema, Document } from 'mongoose';

// User Schema
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'seller', 'admin', 'user'], default: 'customer' },
  addresses: [{
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    isDefault: { type: Boolean, default: false }
  }],
}, { timestamps: true });

export const UserModel = (mongoose.models.User || mongoose.model('User', UserSchema)) as any;

// Category Schema
const CategorySchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String, required: true }
}, { timestamps: true });

export const CategoryModel = (mongoose.models.Category || mongoose.model('Category', CategorySchema)) as any;

// Review Schema (embedded in Product but kept here for reference)
export const ReviewSchema = new Schema({
  id: { type: String },
  user: { type: String, required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
}, { timestamps: true });

// Product Schema
const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  image: { type: String, required: true },
  images: [String],
  category: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  rating: { type: Number, required: true, default: 0 },
  reviewsCount: { type: Number, required: true, default: 0 },
  reviews: [ReviewSchema],
  featured: { type: Boolean, default: false },
  seller: { type: String, default: 'admin' }
}, { timestamps: true });

export const ProductModel = (mongoose.models.Product || mongoose.model('Product', ProductSchema)) as any;

// Order Schema
const OrderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    quantity: { type: Number, required: true }
  }],
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  paymentMethod: { type: String, required: true, default: 'Razorpay' },
  paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  paymentId: String,
  itemsPrice: { type: Number, required: true, default: 0 },
  shippingPrice: { type: Number, required: true, default: 0 },
  totalPrice: { type: Number, required: true, default: 0 },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
}, { timestamps: true });

export const OrderModel = (mongoose.models.Order || mongoose.model('Order', OrderSchema)) as any;

// Coupon Schema
const CouponSchema = new Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
  active: { type: Boolean, default: true }
}, { timestamps: true });

export const CouponModel = (mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema)) as any;
