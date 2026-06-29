import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { Product } from '../types.js';

interface ProductCardProps {
  product: Product;
  onNavigate: (view: string, id?: string) => void;
  onAddToCartSuccess?: () => void;
  key?: string | number;
}

export default function ProductCard({ product, onNavigate, onAddToCartSuccess }: ProductCardProps) {
  const { wishlist, toggleWishlist, addToCart } = useApp();
  const [imgError, setImgError] = React.useState(!product.image);

  React.useEffect(() => {
    setImgError(!product.image);
  }, [product.image]);

  const isWishlisted = wishlist.some((p) => p.id === product.id || p._id === product._id);
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1);
    if (onAddToCartSuccess) onAddToCartSuccess();
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      onClick={() => onNavigate('product-details', product.id || product._id)}
      className="group bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300 cursor-pointer flex flex-col h-full relative"
    >
      {/* Wishlist Heart overlay */}
      <button
        onClick={handleToggleWishlist}
        className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/90 dark:bg-zinc-800/90 hover:bg-white dark:hover:bg-zinc-800 text-zinc-400 hover:text-rose-500 shadow border border-zinc-100 dark:border-zinc-700 transition-all active:scale-95"
      >
        <Heart className={`h-4.5 w-4.5 transition-colors ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
      </button>

      {/* Out of Stock badge */}
      {isOutOfStock && (
        <span className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-zinc-900/90 text-white text-[10px] font-extrabold uppercase tracking-widest shadow border border-zinc-800">
          Sold Out
        </span>
      )}

      {/* Featured badge */}
      {!isOutOfStock && product.featured && (
        <span className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold uppercase tracking-widest shadow border border-emerald-400">
          Must Have
        </span>
      )}

      {/* Product Image Frame */}
      <div className="aspect-square bg-zinc-50 dark:bg-zinc-900/50 p-6 flex items-center justify-center relative overflow-hidden">
        {!imgError ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImgError(true)}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 pointer-events-none"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-500 gap-2">
            <ShoppingBag className="h-10 w-10 stroke-[1.2] text-zinc-300 dark:text-zinc-600 animate-pulse" />
            <span className="text-[10px] font-bold tracking-wider uppercase text-zinc-400 dark:text-zinc-500">No Image</span>
          </div>
        )}
      </div>

      {/* Details Box */}
      <div className="p-5 flex flex-col flex-1">
        {/* Category */}
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          {product.category}
        </span>

        {/* Title */}
        <h3 className="text-sm font-bold text-zinc-900 dark:text-white mt-2 group-hover:text-emerald-500 transition-colors line-clamp-1 leading-tight">
          {product.name}
        </h3>

        {/* Description preview */}
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed flex-1">
          {product.description}
        </p>

        {/* Ratings stars row */}
        <div className="flex items-center gap-1.5 mt-3.5">
          <div className="flex items-center text-amber-500">
            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 ml-1">
              {product.rating || '5.0'}
            </span>
          </div>
          <span className="text-zinc-300 dark:text-zinc-700">|</span>
          <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500">
            ({product.reviewsCount || 0} reviews)
          </span>
        </div>

        {/* Price and Add to Cart Row */}
        <div className="flex items-center justify-between mt-5 pt-3.5 border-t border-zinc-100 dark:border-zinc-800">
          <span className="text-base font-black text-zinc-900 dark:text-white">
            ₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`p-2.5 rounded-full flex items-center justify-center transition-all shadow-sm ${
              isOutOfStock
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white active:scale-95 shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30'
            }`}
            title={isOutOfStock ? 'Sold Out' : 'Add to Bag'}
          >
            <ShoppingBag className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
