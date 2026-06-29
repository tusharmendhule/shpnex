import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { ShieldCheck, Mail, Compass, HelpCircle, AlertCircle, ShoppingBag, Send, Phone, MapPin, Heart, ArrowRight } from 'lucide-react';

/* ==========================================
   ABOUT VIEW
   ========================================== */
export function AboutView({ onNavigate }: { onNavigate: (v: string) => void }) {
  return (
    <div className="bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-100 transition-colors duration-300 py-16 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-500">Our Manifesto</span>
        <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight mt-2.5 mb-6">Designed with Architectural Honesty</h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-base leading-relaxed max-w-2xl mx-auto mb-12">
          At ShpNex, we believe products should be as functional as they are beautiful. Our designs reject unnecessary decorations, focusing purely on premium material engineering, intuitive UX flows, and durable mechanical lifespan.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-left mt-12 pb-16 border-b border-zinc-150 dark:border-zinc-850">
          <div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl w-fit text-emerald-500 mb-4">
              <Compass className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white mb-2">Swiss minimalism</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Clean geometric structures, high-contrast typography pairings, and generous negative layouts.
            </p>
          </div>
          <div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl w-fit text-emerald-500 mb-4">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white mb-2">Sustainable Materials</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Using 100% organic cotton brushback fleece, memory-foam earmuffs, and recycled stainless steel frames.
            </p>
          </div>
          <div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl w-fit text-emerald-500 mb-4">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white mb-2">Client Centricity</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              We stand by our crafts with 30-day hassle-free returns and secure payments SSL encrypted via Razorpay.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('shop')}
          className="mt-12 px-8 py-3.5 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-bold uppercase tracking-widest rounded-full transition-all hover:scale-105 active:scale-95 shadow"
        >
          Explore Catalog Collections
        </button>
      </div>
    </div>
  );
}

/* ==========================================
   CONTACT VIEW
   ========================================== */
export function ContactView() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && msg) {
      setSubmitted(true);
      setName('');
      setEmail('');
      setMsg('');
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-100 transition-colors duration-300 py-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-500">Inquiries desk</span>
          <h1 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight mt-2.5">We're Here to Help</h1>
          <p className="text-zinc-500 text-xs mt-3.5 max-w-md mx-auto">Get in touch with our live support, authorized sales managers, or engineering team.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-5xl mx-auto">
          {/* Contact Details col */}
          <div className="lg:col-span-5 space-y-8">
            <div className="flex gap-4">
              <div className="p-3.5 bg-zinc-100 dark:bg-zinc-900 rounded-2xl text-emerald-500 h-fit border border-zinc-200/55 dark:border-zinc-800/55">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-zinc-900 dark:text-white">Call Support Center</h4>
                <p className="text-xs text-zinc-500 mt-1">Direct support hotline (9am - 6pm EST)</p>
                <p className="text-xs text-zinc-900 dark:text-zinc-200 font-bold mt-1.5">+1 (800) 555-NEX-01</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-3.5 bg-zinc-100 dark:bg-zinc-900 rounded-2xl text-emerald-500 h-fit border border-zinc-200/55 dark:border-zinc-800/55">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-zinc-900 dark:text-white">Email Communications</h4>
                <p className="text-xs text-zinc-500 mt-1">General inquires & developer desk</p>
                <p className="text-xs text-emerald-500 font-bold mt-1.5">support@shpnex.com</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-3.5 bg-zinc-100 dark:bg-zinc-900 rounded-2xl text-emerald-500 h-fit border border-zinc-200/55 dark:border-zinc-800/55">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-zinc-900 dark:text-white">Swiss HQ Office</h4>
                <p className="text-xs text-zinc-500 mt-1">Corporate operations & mechanical lab</p>
                <p className="text-xs text-zinc-900 dark:text-zinc-200 font-bold mt-1.5">Bahnhofstrasse 12, 8001 Zürich, Switzerland</p>
              </div>
            </div>
          </div>

          {/* Contact Form col */}
          <div className="lg:col-span-7 bg-zinc-50 dark:bg-zinc-900/40 p-6 sm:p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50">
            {submitted ? (
              <div className="text-center py-12">
                <div className="p-3.5 bg-emerald-100 dark:bg-emerald-950/20 text-emerald-500 rounded-full w-fit mx-auto mb-4">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Message Dispatched!</h3>
                <p className="text-xs text-zinc-500 mt-2">Thank you. An engineering representative will email you back within 12 business hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Tushar"
                      className="w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs px-3.5 py-2.5 font-semibold outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="client@shpnex.com"
                      className="w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs px-3.5 py-2.5 font-semibold outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1">Detailed Message</label>
                  <textarea
                    rows={4}
                    required
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    placeholder="Describe your inquiry..."
                    className="w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs px-3.5 py-2.5 font-semibold outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all"
                >
                  Send Inquiry Message <Send className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   ORDER SUCCESS VIEW
   ========================================== */
export function OrderSuccessView({ orderId, onNavigate }: { orderId: string; onNavigate: (v: string) => void }) {
  return (
    <div className="bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-100 transition-colors duration-300 py-16 font-sans">
      <div className="max-w-md mx-auto px-4 text-center">
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 border border-emerald-100 dark:border-emerald-900/50 shadow-sm animate-pulse">
          <ShieldCheck className="h-10 w-10" />
        </div>
        <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Order Confirmed!</h1>
        <p className="text-xs text-zinc-500 mt-2 max-w-sm mx-auto leading-relaxed">
          Thank you for shopping at ShpNex. Your payment has been authorized and simulated successfully. Your invoice is now active.
        </p>

        {/* Invoice widget details */}
        <div className="my-8 p-5 bg-zinc-50 dark:bg-zinc-900/40 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 text-xs font-semibold space-y-3.5 text-left">
          <div className="flex justify-between text-zinc-500 pb-2 border-b border-zinc-200/30">
            <span>Transaction Receipt</span>
            <span className="text-zinc-900 dark:text-white font-bold">#INV-{orderId.substr(0, 8).toUpperCase()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Fulfilment Order ID</span>
            <span className="text-zinc-900 dark:text-white font-bold">{orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Estimated Logistics Delivery</span>
            <span className="text-emerald-500 font-bold">2-3 Business Days</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch gap-3">
          <button
            onClick={() => onNavigate('shop')}
            className="flex-1 py-3.5 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-extrabold uppercase tracking-widest transition-all"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => onNavigate('user-dashboard')}
            className="flex-1 py-3.5 rounded-full border border-zinc-200 dark:border-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-xs font-bold transition-all"
          >
            Track Order
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   WISHLIST VIEW
   ========================================== */
export function WishlistView({ onNavigate }: { onNavigate: (v: string, id?: string) => void }) {
  const { wishlist, toggleWishlist, addToCart } = useApp();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center font-sans">
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <Heart className="h-10 w-10 text-rose-500" />
        </div>
        <h2 className="text-xl font-black text-zinc-900 dark:text-white">Wishlist is Empty</h2>
        <p className="text-xs text-zinc-500 mt-2.5 max-w-sm mx-auto leading-relaxed">
          Keep track of your favorite luxury apparel, tech accessories and minimalist sneakers by clicking on the heart icon.
        </p>
        <button
          onClick={() => onNavigate('shop')}
          className="mt-8 px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 text-xs font-bold uppercase tracking-widest rounded-full shadow transition-all active:scale-95"
        >
          Explore Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-100 transition-colors duration-300 py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight mb-8">
          Saved Favorites ({wishlist.length})
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((prod) => (
            <ProductCard key={prod.id || prod._id} product={prod} onNavigate={onNavigate} />
          ))}
        </div>
      </div>
    </div>
  );
}
