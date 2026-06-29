import { Request, Response } from 'express';
import { isDbConnected, localDb } from '../config/db.js';
import { CategoryModel } from '../models/schemas.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export async function getCategories(req: Request, res: Response) {
  try {
    if (isDbConnected()) {
      const categories = await CategoryModel.find({});
      res.json({ success: true, categories });
    } else {
      res.json({ success: true, categories: localDb.categories });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// @desc    Create category (Admin only)
// @route   POST /api/categories
// @access  Private/Admin
export async function createCategory(req: Request, res: Response) {
  const { name, slug, image } = req.body;

  if (!name || !slug || !image) {
    res.status(400).json({ success: false, message: 'Please fill in all details' });
    return;
  }

  try {
    if (isDbConnected()) {
      const exists = await CategoryModel.findOne({ slug });
      if (exists) {
        res.status(400).json({ success: false, message: 'Category slug already exists' });
        return;
      }
      const category = await CategoryModel.create({ name, slug, image });
      res.status(201).json({ success: true, category });
    } else {
      const exists = localDb.categories.some((c) => c.slug === slug);
      if (exists) {
        res.status(400).json({ success: false, message: 'Category slug already exists' });
        return;
      }
      const newCategory = {
        id: 'cat_' + Math.random().toString(36).substr(2, 9),
        name,
        slug,
        image
      };
      localDb.categories.push(newCategory);
      res.status(201).json({ success: true, category: newCategory });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// @desc    Delete category (Admin only)
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export async function deleteCategory(req: Request, res: Response) {
  const { id } = req.params;

  try {
    if (isDbConnected()) {
      await CategoryModel.findByIdAndDelete(id);
      res.json({ success: true, message: 'Category deleted successfully' });
    } else {
      const index = localDb.categories.findIndex((c) => c.id === id || c._id?.toString() === id);
      if (index === -1) {
        res.status(404).json({ success: false, message: 'Category not found' });
        return;
      }
      localDb.categories.splice(index, 1);
      res.json({ success: true, message: 'Category deleted successfully' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
