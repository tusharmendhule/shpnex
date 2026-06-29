import React, { useState } from 'react';
import { Mail, ArrowRight, ShieldCheck, Truck, RefreshCw, Zap } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-zinc-900 dark:bg-black text-zinc-400 font-sans border-t border-zinc-800 transition-colors duration-300">
      {/* Upper features grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-zinc-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex items-center gap-4 text-white">
            <div className="p-3 bg-zinc-800 rounded-full">
              <Truck className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">Free Express Shipping</h4>
              <p className="text-xs text-zinc-500">On all orders above ₹150</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-white">
            <div className="p-3 bg-zinc-800 rounded-full">
              <RefreshCw className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">30-Day Easy Returns</h4>
              <p className="text-xs text-zinc-500">Hassle-free dynamic refunds</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-white">
            <div className="p-3 bg-zinc-800 rounded-full">
              <ShieldCheck className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">Secure Payment Gateways</h4>
              <p className="text-xs text-zinc-500">Razorpay 256-bit SSL encrypted</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-white">
            <div className="p-3 bg-zinc-800 rounded-full">
              <Zap className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">24/7 Client Support</h4>
              <p className="text-xs text-zinc-500">Live chat & technical help desk</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main links block */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="text-2xl font-black tracking-tight text-white mb-4">
              <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">Shp</span>Nex
            </div>
            <p className="text-sm text-zinc-500 mb-6 leading-relaxed max-w-sm">
              Premium consumer electronics, footwear, apparel and accessories crafted with Swiss-modern minimalism, exceptional quality, and eye-friendly visual systems.
            </p>
            {/* Newsletter input */}
            <form onSubmit={handleSubscribe} className="max-w-sm">
              <label htmlFor="newsletter-email" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                Join the ShpNex Inner Circle
              </label>
              {subscribed ? (
                <div className="text-sm text-emerald-500 font-medium">
                  ✓ Welcome! You've been subscribed to premium offers.
                </div>
              ) : (
                <div className="flex">
                  <input
                    id="newsletter-email"
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 bg-zinc-800/80 text-white border border-zinc-700/80 text-sm px-4 py-2 rounded-l-lg outline-none focus:border-emerald-500 placeholder-zinc-500"
                  />
                  <button
                    type="submit"
                    className="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold text-sm px-4 py-2 rounded-r-lg flex items-center gap-1 transition-all"
                  >
                    Subscribe <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Nav Categories */}
          <div>
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-6">Explore Collections</h4>
            <ul className="space-y-3.5 text-sm">
              <li><button onClick={() => onNavigate('shop')} className="hover:text-emerald-500 transition-colors">Electronics</button></li>
              <li><button onClick={() => onNavigate('shop')} className="hover:text-emerald-500 transition-colors">Apparel & Hoodies</button></li>
              <li><button onClick={() => onNavigate('shop')} className="hover:text-emerald-500 transition-colors">Minimal Footwear</button></li>
              <li><button onClick={() => onNavigate('shop')} className="hover:text-emerald-500 transition-colors">Luxury Accessories</button></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-6">Our Company</h4>
            <ul className="space-y-3.5 text-sm">
              <li><button onClick={() => onNavigate('about')} className="hover:text-emerald-500 transition-colors">About Us</button></li>
              <li><button onClick={() => onNavigate('about')} className="hover:text-emerald-500 transition-colors">Sustainable Craft</button></li>
              <li><button onClick={() => onNavigate('about')} className="hover:text-emerald-500 transition-colors">Press & Media</button></li>
              <li><button onClick={() => onNavigate('contact')} className="hover:text-emerald-500 transition-colors">Careers</button></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="font-bold text-sm text-white uppercase tracking-wider mb-6">Help & Support</h4>
            <ul className="space-y-3.5 text-sm">
              <li><button onClick={() => onNavigate('contact')} className="hover:text-emerald-500 transition-colors">Contact Support</button></li>
              <li><button onClick={() => onNavigate('contact')} className="hover:text-emerald-500 transition-colors">Returns & Exchanges</button></li>
              <li><button onClick={() => onNavigate('contact')} className="hover:text-emerald-500 transition-colors">FAQs & Help</button></li>
              <li><button onClick={() => onNavigate('contact')} className="hover:text-emerald-500 transition-colors">Shipping Information</button></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copy */}
      <div className="bg-zinc-950 text-xs py-8 border-t border-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-zinc-600">&copy; {new Date().getFullYear()} ShpNex Inc. All rights reserved. Built with MERN Stack + Vite.</p>
          <div className="flex space-x-6 text-zinc-600">
            <button onClick={() => onNavigate('about')} className="hover:text-zinc-400 transition-colors">Privacy Policy</button>
            <button onClick={() => onNavigate('about')} className="hover:text-zinc-400 transition-colors">Terms of Service</button>
            <button onClick={() => onNavigate('about')} className="hover:text-zinc-400 transition-colors">Sitemap</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
