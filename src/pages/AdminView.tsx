import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import DashboardWidgets from '../components/DashboardWidgets';
import Charts from '../components/Charts';
import { Product, Order, User } from '../types.js';
import { LayoutDashboard, Package, ShoppingBag, Users, Calendar, ArrowRight, ShieldCheck, Plus, Trash2, Edit, AlertCircle, RefreshCw } from 'lucide-react';

interface AdminViewProps {
  onNavigate: (view: string) => void;
}

export default function AdminView({ onNavigate }: AdminViewProps) {
  const { user, fetchDashboardMetrics, fetchAllOrders, fetchAllUsers, updateOrderStatus, products, fetchProducts, createReview, categories } = useApp();
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders' | 'users'>('analytics');
  const [metrics, setMetrics] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // New product form
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodImg, setProdImg] = useState('');
  const [prodCat, setProdCat] = useState('Electronics');
  const [prodStock, setProdStock] = useState('20');
  const [prodFeatured, setProdFeatured] = useState(false);
  const [prodMessage, setProdMessage] = useState('');

  useEffect(() => {
    if (activeTab === 'analytics') {
      loadAnalytics();
    } else if (activeTab === 'orders') {
      loadOrders();
    } else if (activeTab === 'users') {
      loadUsers();
    }
  }, [activeTab]);

  const loadAnalytics = async () => {
    setLoading(true);
    const data = await fetchDashboardMetrics();
    setMetrics(data);
    setLoading(false);
  };

  const loadOrders = async () => {
    setLoading(true);
    const data = await fetchAllOrders();
    setOrders(data);
    setLoading(false);
  };

  const loadUsers = async () => {
    setLoading(true);
    const data = await fetchAllUsers();
    setUsers(data);
    setLoading(false);
  };

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
        setProdMessage('✓ Product created successfully in catalog!');
        setProdName('');
        setProdDesc('');
        setProdPrice('');
        setProdImg('');
        setProdFeatured(false);
        // Refresh product contexts
        fetchProducts();
      } else {
        setProdMessage(`❌ ${data.message || 'Failed to create product'}`);
      }
    } catch (err) {
      setProdMessage('❌ Server error creating product.');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you absolutely sure you want to delete this catalog item?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('shpnex_token')}` }
      });
      const data = await res.json();
      if (data.success) {
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusUpdate = async (orderId: string, status: string) => {
    const success = await updateOrderStatus(orderId, status);
    if (success) {
      loadOrders();
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto py-24 text-center font-sans">
        <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-xl font-black text-zinc-900 dark:text-white">Admin Privileges Required</h2>
        <p className="text-xs text-zinc-500 mt-2 max-w-sm mx-auto leading-relaxed">
          This workspace dashboard requires administrator role access. Please sign in with an administrator account to view dashboard metrics.
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
        {/* Admin page header */}
        <div className="border-b border-zinc-100 dark:border-zinc-800 pb-6 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-500">Workspace Controls</span>
            <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight mt-1">ShpNex Admin Panel</h1>
          </div>

          {/* Quick Stats overview */}
          <div className="text-xs font-bold text-zinc-500 flex items-center gap-2">
            🛡️ Secure Admin: <span className="text-emerald-500 font-extrabold">{user.name}</span>
          </div>
        </div>

        {/* Horizontal Navigation Control tabs */}
        <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-8">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2.5 text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'analytics'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" /> Analytics Dashboard
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'products'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Package className="h-4 w-4" /> Catalog Management
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <ShoppingBag className="h-4 w-4" /> Order Fulfilment
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'users'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Users className="h-4 w-4" /> Client List
          </button>
        </div>

        {/* Main Content Area */}
        <div>
          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              {loading ? (
                <div className="text-center py-24">
                  <div className="h-8 w-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-xs text-zinc-500 font-medium">Computing revenue charts & metrics analytics...</p>
                </div>
              ) : (
                <>
                  {/* KPI cards */}
                  <DashboardWidgets metrics={metrics} />

                  {/* Graph visualizers */}
                  {metrics && (
                    <Charts
                      salesTrend={metrics.salesTrend}
                      categoriesBreakdown={metrics.categoriesBreakdown}
                    />
                  )}
                </>
              )}
            </div>
          )}

          {/* PRODUCTS TAB */}
          {activeTab === 'products' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-extrabold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                  Products Catalog ({products.length})
                </h2>
                {!showAddProduct && (
                  <button
                    onClick={() => setShowAddProduct(true)}
                    className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow transition-all active:scale-95"
                  >
                    <Plus className="h-4 w-4" /> Add Catalog Item
                  </button>
                )}
              </div>

              {showAddProduct && (
                <form onSubmit={handleCreateProduct} className="max-w-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-850">
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Register New Product</h3>
                    <button type="button" onClick={() => setShowAddProduct(false)} className="text-xs text-zinc-500 hover:text-zinc-800 font-bold">
                      Cancel
                    </button>
                  </div>

                  {prodMessage && (
                    <div className={`p-4 text-xs font-semibold rounded-2xl ${prodMessage.startsWith('✓') ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 border border-emerald-100 dark:border-emerald-900/50' : 'bg-rose-50 dark:bg-rose-950/20 text-rose-500 border border-rose-100'}`}>
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
                      placeholder="e.g. Acoustic Noise-Cancelling Headphones"
                      className="w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs px-3.5 py-2.5 font-semibold outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 mb-1">Description Specs</label>
                    <textarea
                      rows={3}
                      required
                      value={prodDesc}
                      onChange={(e) => setProdDesc(e.target.value)}
                      placeholder="e.g. Experience pure immersive sound..."
                      className="w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs px-3.5 py-2.5 font-semibold outline-none focus:border-rose-500"
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
                        placeholder="299.99"
                        className="w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs px-3.5 py-2.5 font-semibold outline-none focus:border-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 mb-1">Initial Stock</label>
                      <input
                        type="number"
                        required
                        value={prodStock}
                        onChange={(e) => setProdStock(e.target.value)}
                        placeholder="12"
                        className="w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs px-3.5 py-2.5 font-semibold outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 mb-1">Category</label>
                      <select
                        value={prodCat}
                        onChange={(e) => setProdCat(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs px-3.5 py-2.5 font-semibold outline-none focus:border-rose-500"
                      >
                        {categories.map((cat: any) => (
                          <option key={cat.id || cat.name} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 mb-1">Image Asset URL</label>
                      <input
                        type="text"
                        required
                        value={prodImg}
                        onChange={(e) => setProdImg(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs px-3.5 py-2.5 font-semibold outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      id="feat-chk"
                      type="checkbox"
                      checked={prodFeatured}
                      onChange={(e) => setProdFeatured(e.target.checked)}
                      className="h-4 w-4 rounded text-rose-500 focus:ring-rose-500 border-zinc-300"
                    />
                    <label htmlFor="feat-chk" className="text-xs font-bold text-zinc-600 dark:text-zinc-300">
                      Promote to Featured Spotlight
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all"
                  >
                    Save Catalog Item
                  </button>
                </form>
              )}

              {/* Products table list */}
              <div className="overflow-x-auto rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900/40">
                <table className="w-full text-left border-collapse text-xs font-semibold">
                  <thead>
                    <tr className="bg-zinc-50 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500 uppercase tracking-wider text-[10px] border-b border-zinc-200 dark:border-zinc-800">
                      <th className="p-4">Item Details</th>
                      <th className="p-4">Collection</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">In Stock</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200/50 dark:divide-zinc-850">
                    {products.map((p) => (
                      <tr key={p.id || p._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50">
                        <td className="p-4 flex items-center gap-3">
                          <div className="h-10 w-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1 flex items-center justify-center flex-shrink-0">
                            <img
                              src={p.image}
                              alt={p.name}
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).onerror = null;
                                (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=100&auto=format&fit=crop&q=80';
                              }}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                          <div>
                            <p className="text-zinc-900 dark:text-white font-bold max-w-xs truncate">{p.name}</p>
                            <p className="text-[10px] text-zinc-400 mt-0.5">Rating: {p.rating || '5.0'} ⭐</p>
                          </div>
                        </td>
                        <td className="p-4 text-zinc-600 dark:text-zinc-400">{p.category}</td>
                        <td className="p-4 text-zinc-900 dark:text-white font-bold">₹{p.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${p.stock > 0 ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500' : 'bg-rose-50 dark:bg-rose-950/20 text-rose-500'}`}>
                            {p.stock} units
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleDeleteProduct(p.id || p._id || '')}
                            className="p-1.5 text-zinc-400 hover:text-rose-500 rounded-full hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all active:scale-95"
                            title="Remove catalog item"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-6">
                Active Order Fulfilment Queue ({orders.length})
              </h2>

              {loading ? (
                <div className="text-center py-12">
                  <div className="h-8 w-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-xs text-zinc-500">Querying orders collection...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-900/40 rounded-3xl border border-zinc-200 dark:border-zinc-800">
                  <p className="text-xs text-zinc-500 font-medium">No order transactions found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div key={ord.id || ord._id} className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50 p-6 rounded-3xl hover:shadow-sm">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-zinc-200/50 dark:border-zinc-800/50">
                        <div>
                          <p className="text-[10px] font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">ORDER ID</p>
                          <p className="text-xs font-black text-zinc-900 dark:text-white">{ord.id || ord._id}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Client Account</p>
                          <p className="text-xs text-zinc-600 dark:text-zinc-300">{(ord.user as any)?.name || 'Demo User'} <span className="text-zinc-400">({(ord.user as any)?.email || 'tushar@example.com'})</span></p>
                        </div>
                        <div>
                          <p className="text-[10px] font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Total cost</p>
                          <p className="text-xs font-black text-zinc-900 dark:text-white">₹{ord.totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        </div>

                        {/* Order status picker */}
                        <div>
                          <label className="block text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest mb-1">Fulfilment Status</label>
                          <select
                            value={ord.status}
                            onChange={(e) => handleStatusUpdate(ord.id || ord._id || '', e.target.value)}
                            className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs px-2.5 py-1.5 font-semibold outline-none"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      {/* Items row list */}
                      <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2">Purchased Products</p>
                          <div className="space-y-2">
                            {ord.orderItems.map((item, idx) => (
                              <div key={idx} className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                                • {item.name} <span className="text-zinc-400">x{item.quantity}</span> - <span className="text-zinc-900 dark:text-white font-bold">₹{item.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2">Shipping Coordinates</p>
                          <div className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            <p className="text-zinc-900 dark:text-white font-bold">{ord.shippingAddress?.street}</p>
                            <p>{ord.shippingAddress?.city}, {ord.shippingAddress?.state} {ord.shippingAddress?.zipCode}</p>
                            <p className="text-zinc-500">{ord.shippingAddress?.country}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                Registered Client Database ({users.length})
              </h2>

              {loading ? (
                <div className="text-center py-12">
                  <div className="h-8 w-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-xs text-zinc-500">Retrieving clients roster...</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900/40">
                  <table className="w-full text-left border-collapse text-xs font-semibold">
                    <thead>
                      <tr className="bg-zinc-50 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-500 uppercase tracking-wider text-[10px] border-b border-zinc-200 dark:border-zinc-800">
                        <th className="p-4">Name</th>
                        <th className="p-4">Email Coordinates</th>
                        <th className="p-4">Role Permission</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200/50 dark:divide-zinc-850 text-zinc-600 dark:text-zinc-400">
                      {users.map((u) => (
                        <tr key={u.id || u._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50">
                          <td className="p-4 text-zinc-900 dark:text-white font-bold">{u.name}</td>
                          <td className="p-4">{u.email}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${u.role === 'admin' ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-500' : 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500'}`}>
                              {u.role}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
