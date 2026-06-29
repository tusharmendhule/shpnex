import { Response } from 'express';
import Stripe from 'stripe';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { OrderModel } from '../models/schemas.js';
import { isDbConnected, localDb } from '../config/db.js';

let stripeClient: Stripe | null = null;

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return null;
  }
  if (!stripeClient) {
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}

// @desc    Create Stripe Checkout Session
// @route   POST /api/payment/create-checkout-session
// @access  Private
export async function createCheckoutSession(req: AuthenticatedRequest, res: Response) {
  const { orderId } = req.body;

  if (!orderId) {
    res.status(400).json({ success: false, message: 'Order ID is required' });
    return;
  }

  try {
    let order: any = null;

    if (isDbConnected()) {
      order = await OrderModel.findById(orderId);
    } else {
      order = localDb.orders.find((o) => o.id === orderId);
    }

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    const stripe = getStripe();
    if (!stripe) {
      // If Stripe is not configured, we return a fallback response with a simulation flag
      console.log('⚠️ [Stripe] STRIPE_SECRET_KEY is not set. Falling back to Payment Simulator mode.');
      res.json({
        success: true,
        simulation: true,
        message: 'Stripe is running in simulator mode. Configure STRIPE_SECRET_KEY in the Secrets panel to accept live payments.',
      });
      return;
    }

    // Configure success and cancel URLs
    const appUrl = process.env.APP_URL || 'http://localhost:3000';
    const successUrl = `${appUrl}?view=dashboard&tab=orders&success=true&orderId=${orderId}`;
    const cancelUrl = `${appUrl}?view=cart&cancelled=true&orderId=${orderId}`;

    // Map order items to Stripe line items
    const lineItems = order.orderItems.map((item: any) => ({
      price_data: {
        currency: 'inr', // We use INR since prices are in rupees
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100), // Stripe accepts amount in cents/paise
      },
      quantity: item.quantity,
    }));

    // Add shipping price if applicable
    if (order.shippingPrice > 0) {
      lineItems.push({
        price_data: {
          currency: 'inr',
          product_data: {
            name: 'Shipping Charges',
          },
          unit_amount: Math.round(order.shippingPrice * 100),
        },
        quantity: 1,
      });
    }

    // Create session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        orderId: orderId.toString(),
      },
    });

    res.json({
      success: true,
      id: session.id,
      url: session.url,
    });
  } catch (error: any) {
    console.error('❌ [Stripe] Checkout error:', error);
    res.status(500).json({ success: false, message: error.message || 'Stripe Session creation failed' });
  }
}
