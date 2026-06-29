import { Response } from 'express';
import { isDbConnected, localDb } from '../config/db.js';
import { ProductModel } from '../models/schemas.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

// @desc    Create product review
// @route   POST /api/reviews/:productId
// @access  Private
export async function createReview(req: AuthenticatedRequest, res: Response) {
  const { productId } = req.params;
  const { rating, comment } = req.body;

  if (rating === undefined || !comment) {
    res.status(400).json({ success: false, message: 'Please provide rating and comment' });
    return;
  }

  try {
    const newReview = {
      id: 'rev_' + Math.random().toString(36).substr(2, 9),
      user: req.user?.id || '',
      name: req.user?.name || 'Anonymous',
      rating: Number(rating),
      comment,
      createdAt: new Date().toISOString()
    };

    if (isDbConnected()) {
      const product = await ProductModel.findById(productId);
      if (!product) {
        res.status(404).json({ success: false, message: 'Product not found' });
        return;
      }

      // Check if user already reviewed
      const alreadyReviewed = product.reviews.find(
        (r: any) => r.user.toString() === req.user?.id
      );

      if (alreadyReviewed) {
        res.status(400).json({ success: false, message: 'Product already reviewed' });
        return;
      }

      product.reviews.push(newReview);
      product.reviewsCount = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ success: true, message: 'Review added', product });
    } else {
      const index = localDb.products.findIndex((p) => p.id === productId);
      if (index === -1) {
        res.status(404).json({ success: false, message: 'Product not found' });
        return;
      }

      const product = localDb.products[index];
      if (!product.reviews) product.reviews = [];

      // Check if user already reviewed
      const alreadyReviewed = product.reviews.some((r: any) => r.user === req.user?.id);
      if (alreadyReviewed) {
        res.status(400).json({ success: false, message: 'Product already reviewed' });
        return;
      }

      product.reviews.push(newReview);
      product.reviewsCount = product.reviews.length;
      product.rating = Number(
        (product.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) /
          product.reviews.length).toFixed(1)
      );

      res.status(201).json({ success: true, message: 'Review added', product });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// @desc    Delete product review
// @route   DELETE /api/reviews/:productId/:reviewId
// @access  Private
export async function deleteReview(req: AuthenticatedRequest, res: Response) {
  const { productId, reviewId } = req.params;

  try {
    const userId = req.user?.id || '';

    if (isDbConnected()) {
      const product = await ProductModel.findById(productId);
      if (!product) {
        res.status(404).json({ success: false, message: 'Product not found' });
        return;
      }

      const reviewIndex = product.reviews.findIndex(
        (r: any) => (r.id === reviewId || r._id?.toString() === reviewId)
      );

      if (reviewIndex === -1) {
        res.status(404).json({ success: false, message: 'Review not found' });
        return;
      }

      const review = product.reviews[reviewIndex];

      if (review.user !== userId) {
        res.status(403).json({ success: false, message: 'You can only delete your own reviews' });
        return;
      }

      product.reviews.splice(reviewIndex, 1);
      product.reviewsCount = product.reviews.length;
      
      if (product.reviews.length > 0) {
        product.rating =
          product.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) /
          product.reviews.length;
      } else {
        product.rating = 5.0;
      }

      await product.save();
      res.status(200).json({ success: true, message: 'Review deleted successfully', product });
    } else {
      const index = localDb.products.findIndex((p) => p.id === productId);
      if (index === -1) {
        res.status(404).json({ success: false, message: 'Product not found' });
        return;
      }

      const product = localDb.products[index];
      if (!product.reviews) product.reviews = [];

      const reviewIndex = product.reviews.findIndex(
        (r: any) => (r.id === reviewId || r._id === reviewId)
      );

      if (reviewIndex === -1) {
        res.status(404).json({ success: false, message: 'Review not found' });
        return;
      }

      const review = product.reviews[reviewIndex];

      if (review.user !== userId) {
        res.status(403).json({ success: false, message: 'You can only delete your own reviews' });
        return;
      }

      product.reviews.splice(reviewIndex, 1);
      product.reviewsCount = product.reviews.length;

      if (product.reviews.length > 0) {
        product.rating = Number(
          (product.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) /
            product.reviews.length).toFixed(1)
        );
      } else {
        product.rating = 5.0;
      }

      res.status(200).json({ success: true, message: 'Review deleted successfully', product });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

