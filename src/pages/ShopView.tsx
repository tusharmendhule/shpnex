import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal, Filter, Grid, RefreshCw } from 'lucide-react';

interface ShopViewProps {
  onNavigate: (view: string, id?: string) => void;
  searchTerm: string;
  onSearch: (term: string) => void;
}

export default function ShopView({ onNavigate, searchTerm, onSearch }: ShopViewProps) {
  const { products, categories, fetchProducts, loading } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOption, setSortOption] = useState('newest');

  useEffect(() => {
    fetchProducts({
      category: selectedCategory,
      search: searchTerm,
      sort: sortOption,
    });
  }, [selectedCategory, searchTerm, sortOption]);

  const handleClearFilters = () => {
    setSelectedCategory('');
    onSearch('');
    setSortOption('newest');
  };

  return (
    <div className="bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-100 transition-colors duration-300 min-h-screen py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="border-b border-zinc-100 dark:border-zinc-800 pb-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-500">Premium Catalog</span>
            <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight mt-1">Shop Everything</h1>
          </div>

          {/* Search form inside shop view */}
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Filter products..."
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs pl-9 pr-4 py-2.5 rounded-full border border-zinc-200 dark:border-zinc-800 outline-none focus:border-emerald-500"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
          </div>
        </div>

        {/* Sidebar and Grid layout */}
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters Sidebar */}
          <div className="hidden lg:block space-y-8">
            {/* Category filter */}
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4 flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5" /> Collections
              </h3>
              <div className="space-y-2">
                <button
                  id="cat-filter-all"
                  onClick={() => setSelectedCategory('')}
                  className={`w-full text-left px-3.5 py-2 text-xs font-bold rounded-xl transition-all ${
                    selectedCategory === ''
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  All Products ({products.length})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id || cat._id}
                    id={`cat-filter-${cat.name}`}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`w-full text-left px-3.5 py-2 text-xs font-bold rounded-xl transition-all ${
                      selectedCategory === cat.name
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500'
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sorting Filter */}
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4 flex items-center gap-1.5">
                <SlidersHorizontal className="h-3.5 w-3.5" /> Sort By
              </h3>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 outline-none focus:border-emerald-500 font-bold"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Customer Rated</option>
              </select>
            </div>

            {/* Clear filters trigger */}
            <button
              onClick={handleClearFilters}
              className="w-full py-2.5 text-xs font-extrabold border border-dashed border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50 text-zinc-500 hover:text-emerald-500 dark:text-zinc-400 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Reset Filters
            </button>
          </div>

          {/* Mobile filter panel bar */}
          <div className="lg:hidden flex items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex-1">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 font-bold"
              >
                <option value="">All Collections</option>
                {categories.map((c) => (
                  <option key={c.id || c._id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white text-xs border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 font-bold"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Product grid results */}
          <div className="lg:col-span-3">
            {loading ? (
              // Skeletal Loader Grid
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-5 h-96 animate-pulse flex flex-col gap-4">
                    <div className="bg-zinc-200 dark:bg-zinc-800 aspect-square w-full rounded-2xl" />
                    <div className="bg-zinc-200 dark:bg-zinc-800 h-5 w-2/3 rounded-md" />
                    <div className="bg-zinc-200 dark:bg-zinc-800 h-10 w-full rounded-md" />
                    <div className="flex items-center justify-between mt-auto">
                      <div className="bg-zinc-200 dark:bg-zinc-800 h-6 w-1/4 rounded-md" />
                      <div className="bg-zinc-200 dark:bg-zinc-800 h-8 w-8 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              // Empty search placeholder
              <div className="text-center py-24 bg-zinc-50 dark:bg-zinc-900/40 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 p-8 max-w-lg mx-auto">
                <Grid className="h-10 w-10 text-zinc-400 mx-auto mb-4" />
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">No matches found</h3>
                <p className="text-xs text-zinc-500 mt-2">
                  There are no products matching your active filters. Try refining your queries or category lists.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="mt-6 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white text-xs font-bold rounded-full shadow-sm transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              // Grid list
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id || product._id} product={product} onNavigate={onNavigate} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
