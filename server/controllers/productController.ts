import { Request, Response } from 'express';
import { isDbConnected, localDb } from '../config/db.js';
import { ProductModel } from '../models/schemas.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export async function getProducts(req: Request, res: Response) {
  try {
    const category = req.query.category as string;
    const search = req.query.search as string;
    const sort = req.query.sort as string;

    if (isDbConnected()) {
      let query: any = {};
      if (category) query.category = category;
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }

      let apiQuery = ProductModel.find(query);

      // Sorting
      if (sort === 'price-low') {
        apiQuery = apiQuery.sort({ price: 1 });
      } else if (sort === 'price-high') {
        apiQuery = apiQuery.sort({ price: -1 });
      } else if (sort === 'rating') {
        apiQuery = apiQuery.sort({ rating: -1 });
      } else {
        apiQuery = apiQuery.sort({ createdAt: -1 });
      }

      const products = await apiQuery;
      res.json({ success: true, products });
    } else {
      // Local db
      let products = [...localDb.products];

      if (category) {
        products = products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
      }

      if (search) {
        const term = search.toLowerCase();
        products = products.filter((p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term)
        );
      }

      if (sort === 'price-low') {
        products.sort((a, b) => a.price - b.price);
      } else if (sort === 'price-high') {
        products.sort((a, b) => b.price - a.price);
      } else if (sort === 'rating') {
        products.sort((a, b) => b.rating - a.rating);
      } else {
        // default newest
        products.reverse();
      }

      res.json({ success: true, products });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// @desc    Get product details
// @route   GET /api/products/:id
// @access  Public
export async function getProductById(req: Request, res: Response) {
  const { id } = req.params;

  try {
    if (isDbConnected()) {
      const product = await ProductModel.findById(id);
      if (!product) {
        res.status(404).json({ success: false, message: 'Product not found' });
        return;
      }
      res.json({ success: true, product });
    } else {
      const product = localDb.products.find((p) => p.id === id);
      if (!product) {
        res.status(404).json({ success: false, message: 'Product not found' });
        return;
      }
      res.json({ success: true, product });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// @desc    Create product (Admin/Seller only)
// @route   POST /api/products
// @access  Private/Admin/Seller
export async function createProduct(req: AuthenticatedRequest, res: Response) {
  const { name, description, price, image, category, stock, featured } = req.body;

  if (!name || !description || !price || !image || !category || stock === undefined) {
    res.status(400).json({ success: false, message: 'Please provide all fields' });
    return;
  }

  const sellerId = req.user?.id || 'admin';

  try {
    if (isDbConnected()) {
      const product = await ProductModel.create({
        name,
        description,
        price: Number(price),
        image,
        category,
        stock: Number(stock),
        featured: !!featured,
        rating: 5.0,
        reviewsCount: 0,
        reviews: [],
        seller: sellerId,
      });
      res.status(201).json({ success: true, product });
    } else {
      const newProduct = {
        id: 'p_' + Math.random().toString(36).substr(2, 9),
        name,
        description,
        price: Number(price),
        image,
        category,
        stock: Number(stock),
        featured: !!featured,
        rating: 5.0,
        reviewsCount: 0,
        reviews: [],
        seller: sellerId,
        createdAt: new Date().toISOString()
      };
      localDb.products.push(newProduct);
      res.status(201).json({ success: true, product: newProduct });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// @desc    Update product (Admin/Seller only)
// @route   PUT /api/products/:id
// @access  Private/Admin/Seller
export async function updateProduct(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const { name, description, price, image, category, stock, featured } = req.body;

  try {
    const userRole = req.user?.role;
    const userId = req.user?.id;

    if (isDbConnected()) {
      const product = await ProductModel.findById(id);
      if (!product) {
        res.status(404).json({ success: false, message: 'Product not found' });
        return;
      }

      // Check permissions: admin or owner
      if (userRole === 'seller' && product.seller !== userId) {
        res.status(403).json({ success: false, message: 'Not authorized to edit this product' });
        return;
      }

      if (name) product.name = name;
      if (description) product.description = description;
      if (price !== undefined) product.price = Number(price);
      if (image) product.image = image;
      if (category) product.category = category;
      if (stock !== undefined) product.stock = Number(stock);
      if (featured !== undefined) product.featured = !!featured;

      await product.save();
      res.json({ success: true, product });
    } else {
      const index = localDb.products.findIndex((p) => p.id === id);
      if (index === -1) {
        res.status(404).json({ success: false, message: 'Product not found' });
        return;
      }

      const p = localDb.products[index];

      // Check permissions: admin or owner
      if (userRole === 'seller' && p.seller !== userId) {
        res.status(403).json({ success: false, message: 'Not authorized to edit this product' });
        return;
      }

      localDb.products[index] = {
        ...p,
        name: name || p.name,
        description: description || p.description,
        price: price !== undefined ? Number(price) : p.price,
        image: image || p.image,
        category: category || p.category,
        stock: stock !== undefined ? Number(stock) : p.stock,
        featured: featured !== undefined ? !!featured : p.featured,
      };

      res.json({ success: true, product: localDb.products[index] });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// @desc    Delete product (Admin/Seller only)
// @route   DELETE /api/products/:id
// @access  Private/Admin/Seller
export async function deleteProduct(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;

  try {
    const userRole = req.user?.role;
    const userId = req.user?.id;

    if (isDbConnected()) {
      const product = await ProductModel.findById(id);
      if (!product) {
        res.status(404).json({ success: false, message: 'Product not found' });
        return;
      }

      // Check permissions: admin or owner
      if (userRole === 'seller' && product.seller !== userId) {
        res.status(403).json({ success: false, message: 'Not authorized to delete this product' });
        return;
      }

      await ProductModel.findByIdAndDelete(id);
      res.json({ success: true, message: 'Product deleted' });
    } else {
      const index = localDb.products.findIndex((p) => p.id === id);
      if (index === -1) {
        res.status(404).json({ success: false, message: 'Product not found' });
        return;
      }

      const p = localDb.products[index];

      // Check permissions: admin or owner
      if (userRole === 'seller' && p.seller !== userId) {
        res.status(403).json({ success: false, message: 'Not authorized to delete this product' });
        return;
      }

      localDb.products.splice(index, 1);
      res.json({ success: true, message: 'Product deleted' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
