import React from 'react';
import { ArrowRight, Sparkles, Shield, Compass } from 'lucide-react';

interface HeroProps {
  onNavigate: (view: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  return (
    <div className="relative overflow-hidden bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300 py-16 sm:py-24">
      {/* Absolute graphic background blobs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-500/10 dark:emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-teal-500/10 dark:teal-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
          {/* Main callouts */}
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-semibold tracking-wider uppercase mb-6">
              <Sparkles className="h-3.5 w-3.5" /> Next-Generation Marketplace
            </div>
            <h1 className="text-4xl tracking-tight font-black text-zinc-900 dark:text-white sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl leading-none">
              The Premium Standard of <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Digital Commerce</span>
            </h1>
            <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400 sm:mt-5 sm:text-lg leading-relaxed">
              Explore ShpNex's meticulously engineered products. From active hybrid noise-cancelling headphones to organic heavyweight hoodies, designed with structural precision and pure aesthetics.
            </p>

            <div className="mt-10 sm:flex sm:justify-center lg:justify-start gap-4">
              <button
                onClick={() => onNavigate('shop')}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 font-semibold text-sm transition-all shadow-lg hover:shadow-xl shadow-zinc-950/25 dark:shadow-zinc-50/5 flex items-center gap-2 group"
              >
                Explore Shop <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => onNavigate('about')}
                className="w-full sm:w-auto mt-4 sm:mt-0 inline-flex items-center justify-center px-8 py-3.5 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 font-semibold text-sm transition-all"
              >
                Our Manifesto
              </button>
            </div>

            {/* Badges line */}
            <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-3 gap-6 text-zinc-500 text-xs font-medium">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-500" /> Authorized Retailer
              </div>
              <div className="flex items-center gap-2">
                <Compass className="h-4 w-4 text-emerald-500" /> Swiss-Modern Styling
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-500" /> 100% Genuine Items
              </div>
            </div>
          </div>

          {/* Featured Image display */}
          <div className="mt-16 sm:mt-24 lg:mt-0 lg:col-span-6 flex justify-center relative">
            <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden bg-gradient-to-tr from-emerald-500/10 to-teal-500/20 dark:from-emerald-950/10 dark:to-teal-950/20 p-8 shadow-2xl border border-white/20 dark:border-zinc-800/20">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
                alt="Acoustic Noise-Cancelling Headphones"
                className="w-full h-full object-contain filter drop-shadow-2xl hover:scale-105 transition-transform duration-700 pointer-events-none"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 dark:bg-zinc-900/95 backdrop-blur border border-zinc-200/50 dark:border-zinc-800/50 p-4 rounded-2xl flex items-center justify-between shadow-lg">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Acoustic Noise Headphones</h3>
                  <p className="text-xs text-emerald-500 font-semibold mt-0.5">₹299.99</p>
                </div>
                <button
                  onClick={() => onNavigate('shop')}
                  className="px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-colors"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
