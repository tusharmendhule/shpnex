import React from 'react';
import { Star, User, Trash2 } from 'lucide-react';
import { Review } from '../types.js';
import { useApp } from '../context/AppContext.js';

interface ReviewCardProps {
  review: Review;
  onDelete?: () => void;
  key?: string | number;
}

export default function ReviewCard({ review, onDelete }: ReviewCardProps) {
  const { user } = useApp();
  const starsArray = Array.from({ length: 5 }, (_, i) => i < review.rating);

  const isOwner = user && (user.id === review.user || user._id === review.user);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 p-5 rounded-2xl flex flex-col gap-3">
      <div className="flex items-center justify-between">
        {/* User avatar and name */}
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
            <User className="h-4 w-4 text-zinc-500" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-900 dark:text-white leading-none">{review.name}</h4>
            <span className="text-[10px] text-zinc-400 mt-1 block">
              {review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Verified Buyer'}
            </span>
          </div>
        </div>

        {/* Right side: Stars & Delete Action */}
        <div className="flex items-center gap-3">
          <div className="flex items-center text-amber-500 gap-0.5">
            {starsArray.map((isFilled, idx) => (
              <Star
                key={idx}
                className={`h-3 w-3 ${isFilled ? 'fill-amber-500' : 'text-zinc-200 dark:text-zinc-700'}`}
              />
            ))}
          </div>

          {isOwner && onDelete && (
            <button
              onClick={onDelete}
              className="p-1.5 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors cursor-pointer"
              title="Delete review"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans">
        {review.comment}
      </p>
    </div>
  );
}

