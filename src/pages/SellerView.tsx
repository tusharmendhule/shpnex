import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types.js';
import { LayoutDashboard, Package, ShieldCheck, Plus, Trash2, Edit, AlertCircle, RefreshCw, ShoppingBag, Store } from 'lucide-react';

interface SellerViewProps {
  onNavigate: (view: string) => void;
}

export default function SellerView({ onNavigate }: SellerViewProps) {
  const { user, products, fetchProducts, categories } = useApp();
  const [activeTab, setActiveTab] = useState<'analytics' | 'products'>('analytics');
  const [loading, setLoading] = useState(false);

  // Filter products owned by this seller
  const sellerProducts = products.filter((p) => p.seller === user?.id);

  // New product form states
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodImg, setProdImg] = useState('');
  const [prodCat, setProdCat] = useState('Electronics');
  const [prodStock, setProdStock] = useState('20');
  const [prodFeatured, setProdFeatured] = useState(false);
  const [prodMessage, setProdMessage] = useState('');

  // Editing product state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editImg, setEditImg] = useState('');
  const [editCat, setEditCat] = useState('');
  const [editStock, setEditStock] = useState('');
  const [editFeatured, setEditFeatured] = useState(false);
  const [editMessage, setEditMessage] = useState('');

  // Local calculations for metrics
  const totalProducts = sellerProducts.length;
  const outOfStockCount = sellerProducts.filter(p => p.stock === 0).length;
  const totalStock = sellerProducts.reduce((sum, p) => sum + p.stock, 0);
  const totalInventoryValue = sellerProducts.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const averageRating = sellerProducts.length > 0 
    ? (sellerProducts.reduce((sum, p) => sum + (p.rating || 5), 0) / sellerProducts.length).toFixed(1)
    : '5.0';

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setProdMessage('');

    if (!prodName || !prodDesc || !prodPrice || !prodImg || !prodCat || !prodStock) {
      setProdMessage('❌ Please provide all fields');
      return;
    }

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('shpnex_token')}`
        },
        body: JSON.stringify({
          name: prodName,
          description: prodDesc,
          price: Number(prodPrice),
          image: prodImg,
          category: prodCat,
          stock: Number(prodStock),
          featured: prodFeatured,
        })
      });

      const data = await res.json();
      if (data.success) {
        setProdMessage('✓ Product created successfully under your seller account!');
        setProdName('');
        setProdDesc('');
        setProdPrice('');
        setProdImg('');
        setProdFeatured(false);
        // Refresh product contexts
        fetchProducts();
        setTimeout(() => {
          setShowAddProduct(false);
          setProdMessage('');
        }, 1500);
      } else {
        setProdMessage(`❌ ${data.message || 'Failed to create product'}`);
      }
    } catch (err) {
      setProdMessage('❌ Server error creating product.');
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setEditName(product.name);
    setEditDesc(product.description);
    setEditPrice(product.price.toString());
    setEditImg(product.image);
    setEditCat(product.category);
    setEditStock(product.stock.toString());
    setEditFeatured(product.featured || false);
    setEditMessage('');
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditMessage('');

    if (!editingProduct) return;

    try {
      const res = await fetch(`/api/products/${editingProduct.id || editingProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('shpnex_token')}`
        },
        body: JSON.stringify({
          name: editName,
          description: editDesc,
          price: Number(editPrice),
          image: editImg,
          category: editCat,
          stock: Number(editStock),
          featured: editFeatured,
        })
      });

      const data = await res.json();
      if (data.success) {
        setEditMessage('✓ Product updated successfully!');
        fetchProducts();
        setTimeout(() => {
          setEditingProduct(null);
          setEditMessage('');
        }, 1500);
      } else {
        setEditMessage(`❌ ${data.message || 'Failed to update product'}`);
      }
    } catch (err) {
      setEditMessage('❌ Server error updating product.');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you absolutely sure you want to delete this product from your inventory?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('shpnex_token')}` }
      });
      const data = await res.json();
      if (data.success) {
        fetchProducts();
      } else {
        alert(data.message || 'Could not delete product');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!user || user.role !== 'seller') {
    return (
      <div className="max-w-md mx-auto py-24 text-center font-sans">
        <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-xl font-black text-zinc-900 dark:text-white">Seller Account Required</h2>
        <p className="text-xs text-zinc-500 mt-2 max-w-sm mx-auto leading-relaxed">
          This dashboard requires a merchant seller account. Please sign in or register with a seller account to manage your listings.
        </p>
        <button
          onClick={() => onNavigate('login')}
          className="mt-6 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-all"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-100 transition-colors duration-300 min-h-screen py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Seller Header */}
        <div className="border-b border-zinc-100 dark:border-zinc-800 pb-6 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-500">Merchant Hub</span>
            <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight mt-1">Seller Portal</h1>
          </div>
          <div className="text-xs font-bold text-zinc-500 flex items-center gap-2">
            <Store className="h-4 w-4 text-emerald-500" />
            Merchant Partner: <span className="text-emerald-500 font-extrabold">{user.name}</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-8">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2.5 text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'analytics'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" /> Performance Metrics
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'products'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Package className="h-4 w-4" /> Manage Inventory
          </button>
        </div>

        {/* Content Area */}
        <div>
          {/* PERFORMANCE / METRICS TAB */}
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              {/* Stat Boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-zinc-50 dark:bg-zinc-900/30 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-850">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Total Catalog Listings</span>
                    <Package className="h-5 w-5 text-zinc-400" />
                  </div>
                  <div className="text-3xl font-black text-zinc-900 dark:text-white">{totalProducts}</div>
                  <p className="text-[10px] text-zinc-500 mt-2 font-semibold">Active online coordinates catalog items</p>
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-900/30 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-850">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-wider text-rose-400">Out of Stock Items</span>
                    <AlertCircle className="h-5 w-5 text-rose-400 animate-pulse" />
                  </div>
                  <div className={`text-3xl font-black ${outOfStockCount > 0 ? 'text-rose-500' : 'text-zinc-900 dark:text-white'}`}>
                    {outOfStockCount}
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-2 font-semibold">Requires restock inventory updates</p>
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-900/30 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-850">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">Average Rating</span>
                    <ShieldCheck className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="text-3xl font-black text-zinc-900 dark:text-white">{averageRating} ⭐</div>
                  <p className="text-[10px] text-zinc-500 mt-2 font-semibold">Based on customer coordinates reviews</p>
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-900/30 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-850">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">Inventory Valuation</span>
                    <ShoppingBag className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-black text-emerald-500">
                    ₹{totalInventoryValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-2 font-semibold">{totalStock} physical units stocked in hubs</p>
                </div>
              </div>

              {/* Guide card */}
              <div className="p-8 bg-zinc-50 dark:bg-zinc-900/20 border border-zinc-200/50 dark:border-zinc-800 rounded-3xl">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Welcome to your ShpNex Merchant Workspace!</h3>
                <p className="text-xs text-zinc-500 leading-relaxed max-w-2xl">
                  As an verified Merchant Partner, you are granted permission to create, edit, and delete premium products within the marketplace catalog under your seller credentials. Customers can view, purchase, and review your listings directly. Add items, manage stock quantities, and keep prices competitive to maximize performance.
                </p>
                <button
                  onClick={() => setActiveTab('products')}
                  className="mt-4 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-all"
                >
                  Manage Your Products
                </button>
              </div>
            </div>
          )}

          {/* INVENTORY / PRODUCTS TAB */}
          {activeTab === 'products' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-extrabold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                  Your Catalog ({sellerProducts.length})
                </h2>
                {!showAddProduct && !editingProduct && (
                  <button
                    onClick={() => setShowAddProduct(true)}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow transition-all active:scale-95"
                  >
                    <Plus className="h-4 w-4" /> Create Product Listing
                  </button>
                )}
              </div>

              {/* ADD PRODUCT FORM */}
              {showAddProduct && (
                <form onSubmit={handleCreateProduct} className="max-w-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-850">
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Create New Merchant Product</h3>
                    <button type="button" onClick={() => setShowAddProduct(false)} className="text-xs text-zinc-500 hover:text-zinc-800 font-bold">
                      Cancel
                    </button>
                  </div>

                  {prodMessage && (
                    <div className={`p-4 text-xs font-semibold rounded-2xl ${prodMessage.startsWith('✓') ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 border border-emerald-100' : 'bg-rose-50 dark:bg-rose-950/20 text-rose-500 border border-rose-100'}`}>
                      {prodMessage}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 mb-1">Product Name</label>
                    <input
                      type="text"
                      required
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                      placeholder="e.g. Leather Executive Briefcase"
                      className="w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs px-3.5 py-2.5 font-semibold outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 mb-1">Description</label>
                    <textarea
                      rows={3}
                      required
                      value={prodDesc}
                      onChange={(e) => setProdDesc(e.target.value)}
                      placeholder="e.g. Handcrafted from top-grain Italian leather, featuring secure organizer sleeves..."
                      className="w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs px-3.5 py-2.5 font-semibold outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 mb-1">Price (₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={prodPrice}
                        onChange={(e) => setProdPrice(e.target.value)}
                        placeholder="1499.00"
                        className="w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs px-3.5 py-2.5 font-semibold outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 mb-1">Category</label>
                      <select
                        value={prodCat}
                        onChange={(e) => setProdCat(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs px-3.5 py-2.5 font-semibold outline-none focus:border-emerald-500"
                      >
                        {categories.map((cat: any) => (
                          <option key={cat.id || cat.name} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 mb-1">Physical Stock Inventory</label>
                      <input
                        type="number"
                        required
                        value={prodStock}
                        onChange={(e) => setProdStock(e.target.value)}
                        placeholder="25"
                        className="w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs px-3.5 py-2.5 font-semibold outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="flex items-center pl-2 pt-6">
                      <input
                        type="checkbox"
                        id="prodFeatured"
                        checked={prodFeatured}
                        onChange={(e) => setProdFeatured(e.target.checked)}
                        className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-700 text-emerald-500 focus:ring-emerald-500 bg-white dark:bg-zinc-900"
                      />
                      <label htmlFor="prodFeatured" className="ml-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                        Mark as Featured Item
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 mb-1">Image Address URL</label>
                    <input
                      type="text"
                      required
                      value={prodImg}
                      onChange={(e) => setProdImg(e.target.value)}
                      placeholder="e.g. https://images.unsplash.com/photo-..."
                      className="w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs px-3.5 py-2.5 font-semibold outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl shadow transition-all hover:shadow-emerald-500/10"
                  >
                    Publish Listing Coordinates
                  </button>
                </form>
              )}

              {/* EDIT PRODUCT FORM */}
              {editingProduct && (
                <form onSubmit={handleUpdateProduct} className="max-w-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-850">
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Edit Product: <span className="text-emerald-500">{editingProduct.name}</span></h3>
                    <button type="button" onClick={() => setEditingProduct(null)} className="text-xs text-zinc-500 hover:text-zinc-800 font-bold">
                      Cancel
                    </button>
                  </div>

                  {editMessage && (
                    <div className={`p-4 text-xs font-semibold rounded-2xl ${editMessage.startsWith('✓') ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500' : 'bg-rose-50 dark:bg-rose-950/20 text-rose-500'}`}>
                      {editMessage}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 mb-1">Product Name</label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs px-3.5 py-2.5 font-semibold outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 mb-1">Description Specs</label>
                    <textarea
                      rows={3}
                      required
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs px-3.5 py-2.5 font-semibold outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 mb-1">Price (₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs px-3.5 py-2.5 font-semibold outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 mb-1">Category</label>
                      <select
                        value={editCat}
                        onChange={(e) => setEditCat(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs px-3.5 py-2.5 font-semibold outline-none focus:border-emerald-500"
                      >
                        {categories.map((cat: any) => (
                          <option key={cat.id || cat.name} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 mb-1">Stock Inventory Quantity</label>
                      <input
                        type="number"
                        required
                        value={editStock}
                        onChange={(e) => setEditStock(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs px-3.5 py-2.5 font-semibold outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="flex items-center pl-2 pt-6">
                      <input
                        type="checkbox"
                        id="editFeatured"
                        checked={editFeatured}
                        onChange={(e) => setEditFeatured(e.target.checked)}
                        className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-700 text-emerald-500 focus:ring-emerald-500 bg-white dark:bg-zinc-900"
                      />
                      <label htmlFor="editFeatured" className="ml-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                        Featured Coordinates Item
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 mb-1">Image Address URL</label>
                    <input
                      type="text"
                      required
                      value={editImg}
                      onChange={(e) => setEditImg(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs px-3.5 py-2.5 font-semibold outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl shadow transition-all"
                  >
                    Apply Update Coordinates
                  </button>
                </form>
              )}

              {/* LIST PRODUCTS GRID */}
              {sellerProducts.length === 0 ? (
                <div className="text-center py-16 bg-zinc-50 dark:bg-zinc-900/10 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
                  <Package className="h-10 w-10 text-zinc-300 mx-auto mb-3" />
                  <p className="text-xs text-zinc-500 font-bold">No product listings recorded under your seller hub.</p>
                  <p className="text-[10px] text-zinc-400 mt-1">Create your first product using the button above.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sellerProducts.map((p) => (
                    <div key={p.id || p._id} className="flex bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800/60 rounded-3xl p-4 gap-4 items-start relative hover:border-zinc-200 dark:hover:border-zinc-700 transition-all">
                      <img
                        src={p.image || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12'}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="h-24 w-24 object-cover rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex-shrink-0 border border-zinc-200/50 dark:border-zinc-800"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-black uppercase text-emerald-500 tracking-wider">
                          {p.category}
                        </span>
                        <h3 className="text-xs font-bold text-zinc-900 dark:text-white truncate mt-0.5">
                          {p.name}
                        </h3>
                        <p className="text-[10px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                          {p.description}
                        </p>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="text-xs font-black text-zinc-900 dark:text-white">
                            ₹{p.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                          </div>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${p.stock > 0 ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400'}`}>
                            {p.stock > 0 ? `${p.stock} units` : 'Out of Stock'}
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="absolute top-4 right-4 flex items-center gap-1.5">
                        <button
                          onClick={() => handleEditProduct(p)}
                          className="p-1.5 text-zinc-400 hover:text-emerald-500 hover:bg-white dark:hover:bg-zinc-850 rounded-lg border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 transition-all"
                          title="Edit Listing"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id || p._id)}
                          className="p-1.5 text-zinc-400 hover:text-rose-500 hover:bg-white dark:hover:bg-zinc-850 rounded-lg border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 transition-all"
                          title="Remove Listing"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
