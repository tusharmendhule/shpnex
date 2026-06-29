import { Response } from 'express';
import { isDbConnected, localDb } from '../config/db.js';
import { OrderModel, ProductModel, UserModel } from '../models/schemas.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

// @desc    Get dashboard metrics & analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
export async function getDashboardAnalytics(req: AuthenticatedRequest, res: Response) {
  try {
    let totalSales = 0;
    let ordersCount = 0;
    let usersCount = 0;
    let productsCount = 0;
    let orders: any[] = [];
    let categoriesBreakdown: { name: string; value: number }[] = [];
    let salesTrend: { date: string; sales: number; orders: number }[] = [];

    if (isDbConnected()) {
      orders = await OrderModel.find({});
      ordersCount = orders.length;
      totalSales = orders.reduce((acc, order) => (order.paymentStatus === 'completed' ? acc + order.totalPrice : acc), 0);
      usersCount = await UserModel.countDocuments({ role: 'user' });
      productsCount = await ProductModel.countDocuments({});

      // Process categories sales breakdown
      const salesByCategory: Record<string, number> = {};
      const products = await ProductModel.find({});
      const productCategoryMap: Record<string, string> = {};
      products.forEach((p) => {
        productCategoryMap[p._id.toString()] = p.category;
      });

      orders.forEach((o) => {
        if (o.paymentStatus === 'completed') {
          o.orderItems.forEach((item: any) => {
            const cat = productCategoryMap[item.product.toString()] || 'Uncategorized';
            salesByCategory[cat] = (salesByCategory[cat] || 0) + item.price * item.quantity;
          });
        }
      });

      categoriesBreakdown = Object.entries(salesByCategory).map(([name, value]) => ({
        name,
        value: Number(value.toFixed(2)),
      }));
    } else {
      // Local db metrics
      orders = localDb.orders;
      ordersCount = orders.length;
      totalSales = orders.reduce((acc, o) => (o.paymentStatus === 'completed' ? acc + o.totalPrice : acc), 0);
      usersCount = localDb.users.filter((u) => u.role === 'user').length;
      productsCount = localDb.products.length;

      // Category sales breakdown
      const salesByCategory: Record<string, number> = {};
      orders.forEach((o) => {
        if (o.paymentStatus === 'completed') {
          o.orderItems.forEach((item: any) => {
            const product = localDb.products.find((p) => p.id === item.product);
            const cat = product ? product.category : 'Electronics';
            salesByCategory[cat] = (salesByCategory[cat] || 0) + item.price * item.quantity;
          });
        }
      });

      categoriesBreakdown = Object.entries(salesByCategory).map(([name, value]) => ({
        name,
        value: Number(value.toFixed(2)),
      }));

      // Fallback categories if empty
      if (categoriesBreakdown.length === 0) {
        categoriesBreakdown = [
          { name: 'Electronics', value: 1200 },
          { name: 'Footwear', value: 800 },
          { name: 'Accessories', value: 450 },
        ];
      }
    }

    // Sales trend last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    salesTrend = last7Days.map((dateStr) => {
      const dayOrders = orders.filter((o) => {
        const orderDate = new Date(o.createdAt).toISOString().split('T')[0];
        return orderDate === dateStr;
      });

      const daySales = dayOrders.reduce(
        (acc, o) => (o.paymentStatus === 'completed' ? acc + o.totalPrice : acc),
        0
      );

      return {
        date: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        sales: Number(daySales.toFixed(2)),
        orders: dayOrders.length,
      };
    });

    res.json({
      success: true,
      analytics: {
        totalSales: Number(totalSales.toFixed(2)),
        ordersCount,
        usersCount,
        productsCount,
        categoriesBreakdown,
        salesTrend,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// @desc    Get all users list (Admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
export async function getAllUsers(req: AuthenticatedRequest, res: Response) {
  try {
    if (isDbConnected()) {
      const users = await UserModel.find({}).select('-password').sort({ createdAt: -1 });
      res.json({ success: true, users });
    } else {
      const users = localDb.users.map(({ password, ...u }) => u);
      res.json({ success: true, users });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
