import { Router } from 'express';
import { protect, admin, adminOrSeller } from '../middleware/auth.js';
import { isDbConnected } from '../config/db.js';
import {
  register,
  login,
  firebaseLogin,
  getProfile,
  updateProfile,
  getAddresses,
  addAddress,
  deleteAddress,
} from '../controllers/authController.js';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import {
  getCategories,
  createCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderStatus,
  getMyOrders,
  getAllOrders,
} from '../controllers/orderController.js';
import { createReview, deleteReview } from '../controllers/reviewController.js';
import { createCheckoutSession } from '../controllers/paymentController.js';
import {
  getCoupons,
  validateCoupon,
  createCoupon,
  deleteCoupon,
} from '../controllers/couponController.js';
import {
  getDashboardAnalytics,
  getAllUsers,
} from '../controllers/adminController.js';

const router = Router();

// Auth Routes
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/firebase-login', firebaseLogin);
router.get('/auth/profile', protect, getProfile);
router.put('/auth/profile', protect, updateProfile);
router.get('/auth/addresses', protect, getAddresses);
router.post('/auth/addresses', protect, addAddress);
router.delete('/auth/addresses/:id', protect, deleteAddress);

// Product Routes
router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.post('/products', protect, adminOrSeller, createProduct);
router.put('/products/:id', protect, adminOrSeller, updateProduct);
router.delete('/products/:id', protect, adminOrSeller, deleteProduct);

// Category Routes
router.get('/categories', getCategories);
router.post('/categories', protect, admin, createCategory);
router.delete('/categories/:id', protect, admin, deleteCategory);

// Order Routes
router.post('/orders', protect, createOrder);
router.get('/orders/myorders', protect, getMyOrders);
router.get('/orders/:id', protect, getOrderById);
router.put('/orders/:id/pay', protect, updateOrderToPaid);
router.put('/orders/:id/status', protect, admin, updateOrderStatus);
router.get('/orders', protect, admin, getAllOrders);

// Payment Routes
router.post('/payment/create-checkout-session', protect, createCheckoutSession);

// Review Routes
router.post('/reviews/:productId', protect, createReview);
router.delete('/reviews/:productId/:reviewId', protect, deleteReview);

// Coupon Routes
router.get('/coupons', protect, admin, getCoupons);
router.post('/coupons', protect, admin, createCoupon);
router.delete('/coupons/:id', protect, admin, deleteCoupon);
router.post('/coupons/validate', protect, validateCoupon);

// Admin Routes
router.get('/admin/analytics', protect, admin, getDashboardAnalytics);
router.get('/admin/users', protect, admin, getAllUsers);

// DB Status Route
router.get('/db-status', (req, res) => {
  const connected = isDbConnected();
  res.json({
    success: true,
    connected,
    mode: connected ? 'production' : 'mock',
    message: connected ? 'Connected to MongoDB Atlas' : 'Running on in-memory Local Sandbox Database',
    provider: 'MongoDB'
  });
});

export default router;
