import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import AddressForm from '../components/AddressForm';
import { Address } from '../types.js';
import { ShieldCheck, CreditCard, ChevronRight, AlertCircle, ShoppingBag, MapPin, Plus } from 'lucide-react';

interface CheckoutViewProps {
  onNavigate: (view: string, orderId?: string) => void;
}

export default function CheckoutView({ onNavigate }: CheckoutViewProps) {
  const { cart, user, createOrder, payOrder, clearCart, getAddresses, addAddress, appliedCoupon, initiateStripeCheckout } = useApp();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number>(-1);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Stripe');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadAddresses() {
      const addrs = await getAddresses();
      setAddresses(addrs);
      if (addrs.length > 0) {
        const defaultIdx = addrs.findIndex((a) => a.isDefault);
        setSelectedAddressIndex(defaultIdx !== -1 ? defaultIdx : 0);
      }
    }
    loadAddresses();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-24 text-center font-sans">
        <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-xl font-black text-zinc-900 dark:text-white">Authentication Required</h2>
        <p className="text-xs text-zinc-500 mt-2 max-w-sm mx-auto leading-relaxed">
          Please log in to your ShpNex account to finalize shipping coordinates and process payment gateways securely.
        </p>
        <button
          onClick={() => onNavigate('login')}
          className="mt-6 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-all"
        >
          Sign In to Account
        </button>
      </div>
    );
  }

  const itemsPrice = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountRate = appliedCoupon ? appliedCoupon.discount : 0;
  const discountAmount = (itemsPrice * discountRate) / 100;
  const shippingPrice = itemsPrice > 150 ? 0 : 15;
  const taxPrice = (itemsPrice - discountAmount) * 0.1;
  const totalPrice = itemsPrice - discountAmount + shippingPrice + taxPrice;

  const handleSaveAddress = async (newAddr: Address) => {
    const updated = await addAddress(newAddr);
    setAddresses(updated);
    setSelectedAddressIndex(updated.length - 1);
    setShowAddressForm(false);
  };

  const handlePlaceOrder = async () => {
    if (selectedAddressIndex === -1) {
      setErrorMessage('Please provide or select a shipping address.');
      return;
    }

    setErrorMessage('');
    setSubmitting(true);
    const shippingAddress = addresses[selectedAddressIndex];

    try {
      const order = await createOrder(shippingAddress, paymentMethod);
      if (order) {
        const orderId = order.id || order._id || '';
        // Navigate directly to the custom secure Payment Gateway page
        clearCart();
        onNavigate('payment-gateway', orderId);
      } else {
        setErrorMessage('Failed to create order. Try verifying stock limits.');
        setSubmitting(false);
      }
    } catch (err) {
      setErrorMessage('Server connection error. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-100 transition-colors duration-300 py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight mb-8">
          Secure Checkout
        </h1>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 text-rose-500 text-xs font-semibold flex items-center gap-2 border border-rose-100 dark:border-rose-900/50">
            <AlertCircle className="h-5 w-5" /> {errorMessage}
          </div>
        )}

        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
          {/* Left Col: Shipping Address & Payments */}
          <div className="lg:col-span-8 space-y-8">
            {/* 1. Shipping Section */}
            <div className="bg-zinc-50 dark:bg-zinc-900/40 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-black text-zinc-900 dark:text-white flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-emerald-500" /> 1. Shipping Coordinates
                </h2>
                {!showAddressForm && (
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="text-xs font-bold text-emerald-500 hover:text-emerald-600 flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" /> Add Address
                  </button>
                )}
              </div>

              {showAddressForm ? (
                <AddressForm onSubmit={handleSaveAddress} onCancel={() => setShowAddressForm(false)} />
              ) : addresses.length === 0 ? (
                <div className="text-center py-8 bg-white dark:bg-zinc-900/60 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
                  <p className="text-xs text-zinc-500 font-medium">No saved addresses on file.</p>
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="mt-4 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg"
                  >
                    Create New Address
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedAddressIndex(idx)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                        selectedAddressIndex === idx
                          ? 'border-emerald-500 bg-emerald-50/10 dark:bg-emerald-950/5 shadow-sm'
                          : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                      }`}
                    >
                      <div className="text-xs leading-relaxed font-semibold">
                        <p className="text-zinc-900 dark:text-white font-bold mb-1">Address Option {idx + 1} {addr.isDefault && <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500 text-white ml-1 font-bold">Default</span>}</p>
                        <p className="text-zinc-600 dark:text-zinc-400">{addr.street}</p>
                        <p className="text-zinc-600 dark:text-zinc-400">{addr.city}, {addr.state} {addr.zipCode}</p>
                        <p className="text-zinc-500 dark:text-zinc-500">{addr.country}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Payments Gateways */}
            <div className="bg-zinc-50 dark:bg-zinc-900/40 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 p-6">
              <h2 className="text-base font-black text-zinc-900 dark:text-white flex items-center gap-2 mb-6">
                <CreditCard className="h-5 w-5 text-emerald-500" /> 2. Secure Payment Gateway
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  onClick={() => setPaymentMethod('Razorpay')}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    paymentMethod === 'Razorpay'
                      ? 'border-emerald-500 bg-emerald-50/10 dark:bg-emerald-950/5'
                      : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-600 dark:text-zinc-300">
                      <CreditCard className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Razorpay Checkout</h4>
                      <p className="text-[10px] text-zinc-400 font-bold mt-0.5 uppercase tracking-wide">Credit Card, Netbanking, UPI</p>
                    </div>
                  </div>
                  <span className={`h-4.5 w-4.5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'Razorpay' ? 'border-emerald-500' : 'border-zinc-300'}`}>
                    {paymentMethod === 'Razorpay' && <span className="h-2 w-2 rounded-full bg-emerald-500" />}
                  </span>
                </div>

                <div
                  onClick={() => setPaymentMethod('Stripe')}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between opacity-65 hover:opacity-100 ${
                    paymentMethod === 'Stripe'
                      ? 'border-emerald-500 bg-emerald-50/10 dark:bg-emerald-950/5'
                      : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-600 dark:text-zinc-300">
                      <ShieldCheck className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Stripe Express</h4>
                      <p className="text-[10px] text-zinc-400 font-bold mt-0.5 uppercase tracking-wide">Apple Pay, Google Pay, Cards</p>
                    </div>
                  </div>
                  <span className={`h-4.5 w-4.5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'Stripe' ? 'border-emerald-500' : 'border-zinc-300'}`}>
                    {paymentMethod === 'Stripe' && <span className="h-2 w-2 rounded-full bg-emerald-500" />}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Col: Bill checkout checkout */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-zinc-50 dark:bg-zinc-900/40 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 p-6 space-y-6">
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                Order Review
              </h2>

              {/* Items summary */}
              <div className="space-y-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
                {cart.map((item) => (
                  <div key={item.product.id || item.product._id} className="flex items-center justify-between gap-4 text-xs font-semibold">
                    <span className="text-zinc-500 line-clamp-1 flex-1">{item.product.name} <span className="text-zinc-400">x{item.quantity}</span></span>
                    <span className="text-zinc-900 dark:text-white font-bold">₹{(item.product.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                ))}
              </div>

              {/* Costs summary breakdown */}
              <div className="space-y-3 text-xs font-semibold">
                <div className="flex items-center justify-between text-zinc-500">
                  <span>Cart Items Subtotal</span>
                  <span className="text-zinc-900 dark:text-white font-bold">₹{itemsPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex items-center justify-between text-rose-500">
                    <span>Promo Coupon Discount</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-zinc-500">
                  <span>Shipping Cost</span>
                  <span>{shippingPrice === 0 ? 'Free' : `₹${shippingPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</span>
                </div>
                <div className="flex items-center justify-between text-zinc-500">
                  <span>Estimated VAT Tax</span>
                  <span className="text-zinc-900 dark:text-white font-bold">₹{taxPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="border-t border-zinc-200 dark:border-zinc-800 my-4 pt-4 flex items-center justify-between text-sm">
                  <span className="font-bold text-zinc-900 dark:text-white">Total Charge</span>
                  <span className="text-base font-black text-zinc-900 dark:text-white">₹{totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                onClick={handlePlaceOrder}
                disabled={submitting || cart.length === 0}
                className={`w-full py-4 rounded-full font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                  submitting
                    ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20 active:scale-95'
                }`}
              >
                {submitting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Opening Secure Gateway...
                  </>
                ) : (
                  <>
                    Proceed to Payment Gateway <ShieldCheck className="h-4.5 w-4.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
