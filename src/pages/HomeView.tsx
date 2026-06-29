import React from 'react';
import { useApp } from '../context/AppContext';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Sparkles, Footprints, Shield, Gift } from 'lucide-react';

interface HomeViewProps {
  onNavigate: (view: string, id?: string) => void;
  onSearch: (term: string) => void;
}

export default function HomeView({ onNavigate, onSearch }: HomeViewProps) {
  const { products, categories } = useApp();

  const featuredProducts = products.filter((p) => p.featured).slice(0, 3);
  const latestProducts = products.slice(0, 4);

  const handleCategoryClick = (catName: string) => {
    onSearch('');
    onNavigate('shop');
    // Fetch filter category inside Shop
    setTimeout(() => {
      const el = document.getElementById(`cat-filter-${catName}`);
      if (el) el.click();
    }, 100);
  };

  return (
    <div className="bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-100 transition-colors duration-300 font-sans pb-12">
      {/* Featured Collections / Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-500">Curated Choices</span>
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight mt-1">Shop by Category</h2>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs font-bold text-emerald-500 hover:text-emerald-600 flex items-center gap-1 group transition-colors"
          >
            See All Shop <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id || cat._id}
              onClick={() => handleCategoryClick(cat.name)}
              className="group relative h-48 rounded-3xl overflow-hidden cursor-pointer shadow-sm border border-zinc-200/50 dark:border-zinc-800/50 hover:shadow-lg transition-all duration-300"
            >
              <img
                src={cat.image}
                alt={cat.name}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).onerror = null;
                  (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400&auto=format&fit=crop&q=80';
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95 dark:brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent flex items-end p-5">
                <div>
                  <h3 className="text-white text-sm font-extrabold tracking-tight">{cat.name}</h3>
                  <span className="text-[9px] text-zinc-300 uppercase font-bold tracking-widest block mt-0.5 group-hover:text-emerald-400 transition-colors">
                    Explore items →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hero Header */}
      <Hero onNavigate={onNavigate} />

      {/* Promos banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl shadow-emerald-500/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 max-w-lg">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider mb-4">
              <Gift className="h-3.5 w-3.5" /> Special Launch Offer
            </span>
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl leading-tight">
              Get 20% off with coupon code <span className="bg-white text-emerald-600 px-3 py-1 rounded-lg inline-block font-extrabold tracking-wide mt-2">NEX20</span>
            </h2>
            <p className="mt-4 text-emerald-50/90 text-sm leading-relaxed">
              Use code NEX20 at checkout for 20% off all modern electronics, accessories, and minimalist footwear items. Valid for a limited time only.
            </p>
            <button
              onClick={() => onNavigate('shop')}
              className="mt-8 px-6 py-3 bg-zinc-950 hover:bg-zinc-900 active:bg-zinc-800 text-white text-xs font-bold uppercase tracking-widest rounded-full transition-all shadow-md shadow-zinc-950/30"
            >
              Shop Collection
            </button>
          </div>
        </div>
      </section>

      {/* Featured Grid */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-10 text-center">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-500">Premium Spotlight</span>
            <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight mt-1.5">Featured Masterpieces</h2>
            <p className="text-zinc-500 max-w-md mx-auto text-xs mt-2.5">Explore our top-selling consumer favorites crafted with extreme material longevity and beautiful visual finishes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((prod) => (
              <ProductCard key={prod.id || prod._id} product={prod} onNavigate={onNavigate} />
            ))}
          </div>
        </section>
      )}

      {/* Latest Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-500">Fresh Additions</span>
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight mt-1">Explore Latest Arrivals</h2>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs font-bold text-emerald-500 hover:text-emerald-600 flex items-center gap-1 group transition-colors"
          >
            See All Catalog <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestProducts.map((prod) => (
            <ProductCard key={prod.id || prod._id} product={prod} onNavigate={onNavigate} />
          ))}
        </div>
      </section>
    </div>
  );
}
