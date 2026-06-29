import { Response } from 'express';
import { isDbConnected, localDb } from '../config/db.js';
import { OrderModel, ProductModel } from '../models/schemas.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export async function createOrder(req: AuthenticatedRequest, res: Response) {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, totalPrice } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400).json({ success: false, message: 'No order items' });
    return;
  }

  try {
    if (isDbConnected()) {
      const order = await OrderModel.create({
        user: req.user?.id,
        orderItems,
        shippingAddress,
        paymentMethod,
        paymentStatus: 'pending',
        itemsPrice,
        shippingPrice,
        totalPrice,
        status: 'pending',
      });

      // Update product stocks
      for (const item of orderItems) {
        await ProductModel.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity }
        });
      }

      res.status(201).json({ success: true, order });
    } else {
      const orderId = 'ord_' + Math.random().toString(36).substr(2, 9);
      const newOrder = {
        id: orderId,
        _id: orderId,
        user: req.user?.id,
        orderItems,
        shippingAddress,
        paymentMethod,
        paymentStatus: 'pending',
        itemsPrice,
        shippingPrice,
        totalPrice,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      // Update stocks in localDb
      for (const item of orderItems) {
        const product = localDb.products.find((p) => p.id === item.product);
        if (product) {
          product.stock = Math.max(0, product.stock - item.quantity);
        }
      }

      localDb.orders.push(newOrder);
      res.status(201).json({ success: true, order: newOrder });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// @desc    Get order details
// @route   GET /api/orders/:id
// @access  Private
export async function getOrderById(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;

  try {
    if (isDbConnected()) {
      const order = await OrderModel.findById(id).populate('user', 'name email');
      if (!order) {
        res.status(404).json({ success: false, message: 'Order not found' });
        return;
      }
      res.json({ success: true, order });
    } else {
      const order = localDb.orders.find((o) => o.id === id);
      if (!order) {
        res.status(404).json({ success: false, message: 'Order not found' });
        return;
      }
      const user = localDb.users.find((u) => u.id === order.user);
      const orderPopulated = {
        ...order,
        user: user ? { name: user.name, email: user.email } : { name: 'Unknown User', email: '' }
      };
      res.json({ success: true, order: orderPopulated });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// @desc    Update order payment status / Razorpay callback
// @route   PUT /api/orders/:id/pay
// @access  Private
export async function updateOrderToPaid(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const { paymentId } = req.body;

  try {
    if (isDbConnected()) {
      const order = await OrderModel.findById(id);
      if (!order) {
        res.status(404).json({ success: false, message: 'Order not found' });
        return;
      }

      order.paymentStatus = 'completed';
      order.paymentId = paymentId || 'pay_mock_' + Math.random().toString(36).substr(2, 9);
      order.status = 'processing';

      await order.save();
      res.json({ success: true, order });
    } else {
      const index = localDb.orders.findIndex((o) => o.id === id);
      if (index === -1) {
        res.status(404).json({ success: false, message: 'Order not found' });
        return;
      }

      localDb.orders[index].paymentStatus = 'completed';
      localDb.orders[index].paymentId = paymentId || 'pay_mock_' + Math.random().toString(36).substr(2, 9);
      localDb.orders[index].status = 'processing';

      res.json({ success: true, order: localDb.orders[index] });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export async function updateOrderStatus(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const { status } = req.body;

  try {
    if (isDbConnected()) {
      const order = await OrderModel.findById(id);
      if (!order) {
        res.status(404).json({ success: false, message: 'Order not found' });
        return;
      }

      order.status = status;
      await order.save();
      res.json({ success: true, order });
    } else {
      const index = localDb.orders.findIndex((o) => o.id === id);
      if (index === -1) {
        res.status(404).json({ success: false, message: 'Order not found' });
        return;
      }

      localDb.orders[index].status = status;
      res.json({ success: true, order: localDb.orders[index] });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// @desc    Get user logged in orders
// @route   GET /api/orders/myorders
// @access  Private
export async function getMyOrders(req: AuthenticatedRequest, res: Response) {
  try {
    if (isDbConnected()) {
      const orders = await OrderModel.find({ user: req.user?.id }).sort({ createdAt: -1 });
      res.json({ success: true, orders });
    } else {
      const orders = localDb.orders
        .filter((o) => o.user === req.user?.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      res.json({ success: true, orders });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
export async function getAllOrders(req: AuthenticatedRequest, res: Response) {
  try {
    if (isDbConnected()) {
      const orders = await OrderModel.find({}).populate('user', 'name email').sort({ createdAt: -1 });
      res.json({ success: true, orders });
    } else {
      const orders = [...localDb.orders]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .map((order) => {
          const user = localDb.users.find((u) => u.id === order.user);
          return {
            ...order,
            user: user ? { name: user.name, email: user.email } : { name: 'Unknown User', email: '' }
          };
        });
      res.json({ success: true, orders });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
