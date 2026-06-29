import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Trash2, Plus, Minus, Ticket, ChevronRight, ArrowRight, ArrowLeft } from 'lucide-react';

interface CartViewProps {
  onNavigate: (view: string) => void;
}

export default function CartView({ onNavigate }: CartViewProps) {
  const { cart, updateCartQty, removeFromCart, appliedCoupon, applyCoupon } = useApp();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    if (!couponCode) return;

    const error = await applyCoupon(couponCode);
    if (error) {
      setCouponError(error);
    } else {
      setCouponSuccess('✓ Coupon applied successfully!');
    }
  };

  const itemsPrice = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountRate = appliedCoupon ? appliedCoupon.discount : 0;
  const discountAmount = (itemsPrice * discountRate) / 100;
  const shippingPrice = itemsPrice > 150 ? 0 : 15;
  const taxPrice = (itemsPrice - discountAmount) * 0.1; // 10% VAT
  const totalPrice = itemsPrice - discountAmount + shippingPrice + taxPrice;

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center font-sans">
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="h-10 w-10 text-emerald-500" />
        </div>
        <h2 className="text-xl font-black text-zinc-900 dark:text-white">Your Bag is Empty</h2>
        <p className="text-xs text-zinc-500 mt-2.5 max-w-sm mx-auto leading-relaxed">
          Looks like you haven't added any products to your cart yet. Explore our premium catalog of modern electronics and footwear today.
        </p>
        <button
          onClick={() => onNavigate('shop')}
          className="mt-8 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 text-xs font-bold uppercase tracking-widest rounded-full shadow transition-all active:scale-95"
        >
          Browse Shop
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-100 transition-colors duration-300 py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight mb-8">
          Your Shopping Bag ({cart.reduce((acc, item) => acc + item.quantity, 0)})
        </h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
          {/* Left Col: Cart Rows */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => (
              <div
                key={item.product.id || item.product._id}
                className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-5 rounded-3xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50 transition-all hover:shadow-sm"
              >
                {/* Thumb + Title */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="h-20 w-20 bg-white dark:bg-zinc-800 rounded-2xl p-2.5 flex items-center justify-center border border-zinc-200/50 dark:border-zinc-700/50 flex-shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).onerror = null;
                        (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=150&auto=format&fit=crop&q=80';
                      }}
                      className="max-h-full max-w-full object-contain pointer-events-none"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white line-clamp-1">{item.product.name}</h3>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block mt-1">{item.product.category}</span>
                    <span className="text-xs font-black text-zinc-900 dark:text-white sm:hidden block mt-2">₹{item.product.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>

                {/* Counter and row total */}
                <div className="flex items-center justify-between sm:justify-end gap-6 pt-4 sm:pt-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-850">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-zinc-200 dark:border-zinc-850 rounded-full bg-white dark:bg-zinc-900 px-2.5 py-1">
                    <button
                      onClick={() => updateCartQty(item.product.id || item.product._id || '', item.quantity - 1)}
                      className="p-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-xs font-bold text-zinc-900 dark:text-white px-3">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQty(item.product.id || item.product._id || '', item.quantity + 1)}
                      className="p-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Price cell */}
                  <div className="text-right hidden sm:block w-24">
                    <span className="text-sm font-black text-zinc-900 dark:text-white">₹{(item.product.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>

                  {/* Remove cell */}
                  <button
                    onClick={() => removeFromCart(item.product.id || item.product._id || '')}
                    className="p-2 text-zinc-400 hover:text-rose-500 rounded-full hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all active:scale-95"
                    title="Remove item"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
            ))}

            {/* Back shop actions */}
            <button
              onClick={() => onNavigate('shop')}
              className="mt-4 px-5 py-2.5 rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Continue Shopping
            </button>
          </div>

          {/* Right Col: Bill summary details */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-zinc-50 dark:bg-zinc-900/40 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 p-6 space-y-6">
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                Order Summary
              </h2>

              {/* Coupon forms */}
              <form onSubmit={handleCouponSubmit} className="space-y-3 pb-6 border-b border-zinc-200 dark:border-zinc-800">
                <label className="block text-xs font-semibold text-zinc-500">Promo Code Coupon</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="e.g. NEX20"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs pl-8 pr-3 py-2.5 outline-none focus:border-emerald-500 font-bold placeholder-zinc-400"
                    />
                    <Ticket className="absolute left-2.5 top-3 h-4 w-4 text-zinc-400" />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-bold text-xs rounded-xl transition-all shadow-sm"
                  >
                    Apply
                  </button>
                </div>

                {couponError && <p className="text-rose-500 text-[10px] font-semibold mt-1">{couponError}</p>}
                {couponSuccess && <p className="text-emerald-500 text-[10px] font-semibold mt-1">{couponSuccess}</p>}
                {appliedCoupon && (
                  <p className="text-emerald-500 text-[10px] font-semibold mt-1">
                    ✓ Code {appliedCoupon.code} active: {appliedCoupon.discount}% discount.
                  </p>
                )}
              </form>

              {/* Cost Rows */}
              <div className="space-y-4 text-xs font-semibold">
                <div className="flex items-center justify-between text-zinc-500">
                  <span>Bag Subtotal</span>
                  <span className="text-zinc-900 dark:text-white font-bold">₹{itemsPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex items-center justify-between text-rose-500">
                    <span>Discount ({appliedCoupon.discount}%)</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-zinc-500">
                  <span>Estimated Tax (10%)</span>
                  <span className="text-zinc-900 dark:text-white font-bold">₹{taxPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>

                <div className="flex items-center justify-between text-zinc-500">
                  <span>Express Shipping</span>
                  {shippingPrice === 0 ? (
                    <span className="text-emerald-500 font-bold uppercase tracking-wider">Free</span>
                  ) : (
                    <span className="text-zinc-900 dark:text-white font-bold">₹{shippingPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  )}
                </div>

                {shippingPrice > 0 && (
                  <p className="text-[10px] text-zinc-400 font-medium">Add ₹{(150 - itemsPrice).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} more to qualify for Free Shipping!</p>
                )}

                <div className="border-t border-zinc-200 dark:border-zinc-800 my-4 pt-4 flex items-center justify-between text-sm">
                  <span className="text-zinc-900 dark:text-white font-bold uppercase tracking-wider">Total Bill</span>
                  <span className="text-lg font-black text-zinc-900 dark:text-white">₹{totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => onNavigate('checkout')}
                className="w-full py-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
              >
                Proceed to Checkout <ArrowRight className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
