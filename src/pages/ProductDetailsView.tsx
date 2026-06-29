import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import ReviewCard from '../components/ReviewCard';
import { Product } from '../types.js';
import { ChevronLeft, ShoppingBag, Heart, Star, AlertCircle, Plus, Minus, MessageSquarePlus } from 'lucide-react';

interface ProductDetailsViewProps {
  productId: string;
  onNavigate: (view: string, id?: string) => void;
}

export default function ProductDetailsView({ productId, onNavigate }: ProductDetailsViewProps) {
  const { fetchProductById, addToCart, toggleWishlist, wishlist, createReview, deleteReview, user } = useApp();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  // Review state
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [reviewMessage, setReviewMessage] = useState('');
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    async function loadProduct() {
      setLoading(true);
      const data = await fetchProductById(productId);
      if (active) {
        setProduct(data);
        setImgError(!data?.image);
        setLoading(false);
      }
    }
    loadProduct();
    return () => {
      active = false;
    };
  }, [productId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-zinc-500 font-medium text-sm">Retrieving product engineering profile...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Product not found</h2>
        <button onClick={() => onNavigate('shop')} className="mt-4 text-xs font-bold text-emerald-500 hover:underline">
          ← Back to Shop
        </button>
      </div>
    );
  }

  const isWishlisted = wishlist.some((p) => p.id === product.id || p._id === product._id);
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userComment) return;
    const success = await createReview(product.id || product._id || '', userRating, userComment);
    if (success) {
      setReviewMessage('✓ Thank you! Review saved successfully.');
      setUserComment('');
      // Reload product data
      const data = await fetchProductById(productId);
      setProduct(data);
    } else {
      setReviewMessage('❌ Review submission failed. You may have already reviewed this product.');
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    const success = await deleteReview(product.id || product._id || '', reviewId);
    if (success) {
      setReviewMessage('✓ Review deleted successfully.');
      // Reload product data
      const data = await fetchProductById(productId);
      setProduct(data);
    } else {
      setReviewMessage('❌ Failed to delete review.');
    }
  };

  // Calculate review statistics
  const reviews = product?.reviews || [];
  const reviewsCount = reviews.length;
  const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((rev) => {
    const r = Math.round(rev.rating);
    if (r >= 1 && r <= 5) {
      distribution[r] = (distribution[r] || 0) + 1;
    }
  });

  return (
    <div className="bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-100 transition-colors duration-300 py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <button
          onClick={() => onNavigate('shop')}
          className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-emerald-500 transition-colors mb-8"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Catalog
        </button>

        {/* Product core specs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Left: Product Image */}
          <div className="lg:col-span-6 bg-zinc-50 dark:bg-zinc-900/40 rounded-3xl p-12 flex items-center justify-center border border-zinc-200/50 dark:border-zinc-800/50 relative min-h-[400px]">
            {!imgError ? (
              <img
                src={product.image}
                alt={product.name}
                onError={() => setImgError(true)}
                className="max-h-96 max-w-full object-contain filter drop-shadow-xl hover:scale-105 transition-transform duration-500 pointer-events-none"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600 gap-3">
                <ShoppingBag className="h-16 w-16 stroke-[1.2] text-zinc-300 dark:text-zinc-700 animate-pulse" />
                <span className="text-xs font-bold tracking-wider uppercase text-zinc-400 dark:text-zinc-500">Image Preview Unavailable</span>
              </div>
            )}
          </div>

          {/* Right: Purchase Controls specs */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-500">
              {product.category}
            </span>
            <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight mt-2.5 leading-tight">
              {product.name}
            </h1>

            {/* Ratings and count */}
            <div className="flex items-center gap-2 mt-4 text-xs font-semibold">
              <div className="flex items-center text-amber-500">
                <Star className="h-4 w-4 fill-amber-500" />
                <span className="ml-1 text-zinc-900 dark:text-white font-bold">{product.rating || '5.0'}</span>
              </div>
              <span className="text-zinc-300 dark:text-zinc-800">|</span>
              <span className="text-zinc-500">{product.reviews?.length || 0} customer reviews</span>
            </div>

            {/* Price tag */}
            <div className="text-3xl font-black text-zinc-900 dark:text-white mt-6">
              ₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>

            {/* Specs description */}
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-6 leading-relaxed">
              {product.description}
            </p>

            {/* Quantity select & actions buttons */}
            <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {/* Qty counters */}
              {!isOutOfStock && (
                <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-full bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 justify-between sm:w-32">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-bold text-zinc-900 dark:text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-full font-bold text-xs uppercase tracking-widest transition-all ${
                  isOutOfStock
                    ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-400 cursor-not-allowed border border-zinc-200 dark:border-zinc-800'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white active:scale-95 shadow-md shadow-emerald-500/20'
                }`}
              >
                <ShoppingBag className="h-4.5 w-4.5" />
                {isOutOfStock ? 'Sold Out' : 'Add to Shopping Bag'}
              </button>

              {/* Wishlist toggle */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-4 rounded-full border flex items-center justify-center active:scale-95 transition-all ${
                  isWishlisted
                    ? 'border-rose-200 dark:border-rose-950/30 bg-rose-50 dark:bg-rose-950/20 text-rose-500'
                    : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 dark:text-zinc-400'
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-rose-500' : ''}`} />
              </button>
            </div>

            {/* Stock status detail */}
            <div className="mt-5 text-xs">
              {isOutOfStock ? (
                <span className="text-rose-500 font-semibold">⚠️ Currently Out of Stock. Join the waitlist below.</span>
              ) : (
                <span className="text-emerald-500 font-semibold">✓ Ready to ship. Only {product.stock} items left in stock.</span>
              )}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="border-t border-zinc-100 dark:border-zinc-800 pt-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left col: list of reviews */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-lg font-black text-zinc-900 dark:text-white tracking-tight mb-2">
              Verified Buyer Reviews ({reviewsCount})
            </h3>

            {/* Rating Breakdown Summary Dashboard */}
            {reviewsCount > 0 && (
              <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50 p-6 rounded-2xl flex flex-col md:flex-row gap-8 items-center">
                {/* Big Score */}
                <div className="text-center md:border-r border-zinc-200 dark:border-zinc-800 md:pr-8 shrink-0">
                  <div className="text-5xl font-black text-zinc-900 dark:text-white leading-none">
                    {product.rating || '5.0'}
                  </div>
                  <div className="flex items-center justify-center text-amber-500 gap-0.5 mt-2.5">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating || 5) ? 'fill-amber-500' : 'text-zinc-200 dark:text-zinc-700'}`} />
                    ))}
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mt-2">
                    {reviewsCount} {reviewsCount === 1 ? 'Review' : 'Reviews'}
                  </p>
                </div>

                {/* Progress Bars */}
                <div className="flex-1 w-full space-y-2">
                  {[5, 4, 3, 2, 1].map((starVal) => {
                    const count = distribution[starVal] || 0;
                    const percent = reviewsCount > 0 ? (count / reviewsCount) * 100 : 0;
                    return (
                      <div key={starVal} className="flex items-center gap-3 text-xs">
                        <span className="w-10 font-bold text-zinc-600 dark:text-zinc-400 text-right shrink-0">
                          {starVal} Star
                        </span>
                        <div className="flex-1 h-2 bg-zinc-200 dark:bg-zinc-800/60 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="w-16 font-medium text-zinc-500 text-left shrink-0">
                          {count} ({Math.round(percent)}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {(!product.reviews || product.reviews.length === 0) ? (
              <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-900/30 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
                <AlertCircle className="h-8 w-8 text-zinc-400 mx-auto mb-3" />
                <p className="text-xs text-zinc-500 font-medium">No customer reviews yet. Be the first to review this premium item!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {product.reviews.map((rev) => (
                  <ReviewCard
                    key={rev.id || rev._id}
                    review={rev}
                    onDelete={() => handleDeleteReview(rev.id || rev._id || '')}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right col: add a new review form */}
          <div className="lg:col-span-5">
            {user ? (
              <form onSubmit={handleReviewSubmit} className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 text-zinc-900 dark:text-white">
                  <MessageSquarePlus className="h-5 w-5 text-emerald-500" />
                  <h4 className="font-bold text-sm">Write a Product Review</h4>
                </div>

                {reviewMessage && (
                  <div className={`p-3 text-xs font-semibold rounded-lg ${reviewMessage.startsWith('✓') ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500' : 'bg-rose-50 dark:bg-rose-950/20 text-rose-500'}`}>
                    {reviewMessage}
                  </div>
                )}

                {/* Rating selection stars */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1.5">Your Rating</label>
                  <div className="flex items-center gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map((starNum) => {
                      const isActive = hoverRating !== null ? starNum <= hoverRating : starNum <= userRating;
                      return (
                        <button
                          key={starNum}
                          type="button"
                          onClick={() => setUserRating(starNum)}
                          onMouseEnter={() => setHoverRating(starNum)}
                          onMouseLeave={() => setHoverRating(null)}
                          className="p-1 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star className={`h-6 w-6 transition-all duration-150 ${isActive ? 'fill-amber-500 text-amber-500' : 'text-zinc-200 dark:text-zinc-700'}`} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1">Your Detailed Feedback</label>
                  <textarea
                    rows={4}
                    required
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    placeholder="Describe your user experience. What did you enjoy? What can be refined?"
                    className="w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs px-3.5 py-2.5 outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 active:scale-95 text-white dark:bg-white dark:text-zinc-900 font-bold text-xs uppercase tracking-widest rounded-lg transition-all"
                >
                  Post Review
                </button>
              </form>
            ) : (
              <div className="bg-zinc-50 dark:bg-zinc-900/30 rounded-2xl p-6 text-center border border-zinc-200 dark:border-zinc-800">
                <h4 className="font-bold text-sm text-zinc-900 dark:text-white mb-2">Want to review this item?</h4>
                <p className="text-xs text-zinc-500 mb-4">Please log in to your registered account to share verified purchase reviews.</p>
                <button
                  onClick={() => onNavigate('login')}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-widest rounded-lg transition-all"
                >
                  Log In
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
