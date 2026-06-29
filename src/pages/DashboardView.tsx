import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import AddressForm from '../components/AddressForm';
import DeliveryTracker from '../components/DeliveryTracker';
import { Order, Address } from '../types.js';
import { User, ShoppingBag, MapPin, Settings, AlertCircle, Trash2, Calendar, FileText, ChevronRight } from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (view: string) => void;
}

export default function DashboardView({ onNavigate }: DashboardViewProps) {
  const { user, updateProfile, getAddresses, addAddress, deleteAddress, fetchMyOrders, logout } = useApp();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses'>('profile');

  // Profile forms
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileMessage, setProfileMessage] = useState('');

  // Orders and addresses state
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [myAddresses, setMyAddresses] = useState<Address[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'orders') {
      loadOrders();
    } else if (activeTab === 'addresses') {
      loadAddresses();
    }
  }, [activeTab]);

  const loadOrders = async () => {
    setLoading(true);
    const data = await fetchMyOrders();
    setMyOrders(data);
    setLoading(false);
  };

  const loadAddresses = async () => {
    setLoading(true);
    const data = await getAddresses();
    setMyAddresses(data);
    setLoading(false);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage('');
    const success = await updateProfile(name, email, password || undefined);
    if (success) {
      setProfileMessage('✓ Profile successfully updated!');
      setPassword('');
    } else {
      setProfileMessage('❌ Failed to save updates. Please try again.');
    }
  };

  const handleSaveAddress = async (newAddr: Address) => {
    const updated = await addAddress(newAddr);
    setMyAddresses(updated);
    setShowAddressForm(false);
  };

  const handleDeleteAddress = async (id: string) => {
    const updated = await deleteAddress(id);
    setMyAddresses(updated);
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-24 text-center font-sans">
        <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-xl font-black text-zinc-900 dark:text-white">Authentication Required</h2>
        <p className="text-xs text-zinc-500 mt-2 max-w-sm mx-auto leading-relaxed">
          Please sign in to view your dashboard coordinates, addresses list, and order history records.
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
        {/* Profile Card Header */}
        <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
            <div className="h-16 w-16 bg-gradient-to-tr from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">{user.name}</h1>
              <p className="text-xs text-zinc-500 font-semibold mt-1">{user.email} <span className="text-emerald-500 uppercase ml-2 text-[9px] tracking-widest">{user.role}</span></p>
            </div>
          </div>
          <button
            onClick={() => { logout(); onNavigate('home'); }}
            className="px-5 py-2 rounded-full border border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:border-rose-950 dark:hover:bg-rose-950/20 text-xs font-bold text-rose-500 transition-all active:scale-95"
          >
            Sign Out
          </button>
        </div>

        {/* Navigation tabs Row */}
        <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Settings className="h-4 w-4" /> Edit Profile
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <ShoppingBag className="h-4 w-4" /> Order History
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`px-4 py-2.5 text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'addresses'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <MapPin className="h-4 w-4" /> Saved Addresses
          </button>
        </div>

        {/* Content Tabs switches */}
        <div>
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="max-w-xl">
              <form onSubmit={handleProfileSubmit} className="space-y-4 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl">
                <h2 className="text-sm font-extrabold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-6">
                  Account Details
                </h2>

                {profileMessage && (
                  <div className={`p-4 text-xs font-semibold rounded-2xl ${profileMessage.startsWith('✓') ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 border border-emerald-100 dark:border-emerald-900/50' : 'bg-rose-50 dark:bg-rose-950/20 text-rose-500 border border-rose-100'}`}>
                    {profileMessage}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs px-3.5 py-3 outline-none focus:border-emerald-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1">Email Coordinates</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs px-3.5 py-3 outline-none focus:border-emerald-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-500 mb-1">New Password (leave empty to keep current)</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs px-3.5 py-3 outline-none focus:border-emerald-500 font-semibold"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-extrabold uppercase tracking-widest rounded-xl transition-all shadow-sm"
                >
                  Save Profile Updates
                </button>
              </form>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="text-sm font-extrabold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-6">
                Your Historic Orders
              </h2>

              {loading ? (
                <div className="text-center py-12">
                  <div className="h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-xs text-zinc-500">Querying order transactions history...</p>
                </div>
              ) : myOrders.length === 0 ? (
                <div className="text-center py-16 bg-zinc-50 dark:bg-zinc-900/40 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-lg mx-auto">
                  <ShoppingBag className="h-10 w-10 text-zinc-400 mx-auto mb-3" />
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">No order history found</h3>
                  <p className="text-xs text-zinc-500 mt-2.5">You haven't purchased any items yet. Explore our shop to create your first order!</p>
                  <button onClick={() => onNavigate('shop')} className="mt-6 px-5 py-2.5 bg-emerald-500 text-white text-xs font-bold rounded-full">
                    Shop Now
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {myOrders.map((order) => (
                    <div
                      key={order.id || order._id}
                      className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-6 hover:shadow-sm transition-all"
                    >
                      {/* Top status bar */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pb-4 border-b border-zinc-200/50 dark:border-zinc-800/50 gap-4 mb-4">
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 bg-white dark:bg-zinc-800 rounded-xl text-zinc-600 dark:text-zinc-300 shadow-sm border border-zinc-100 dark:border-zinc-700">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <span className="text-[10px] font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">ORDER ID</span>
                            <span className="text-xs font-black text-zinc-900 dark:text-white">{order.id || order._id}</span>
                          </div>
                        </div>

                        {/* Order Metadata info */}
                        <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 sm:gap-8 text-xs font-semibold">
                          <div>
                            <span className="text-[10px] font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">DATE</span>
                            <span className="text-zinc-700 dark:text-zinc-300">{new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">TOTAL COST</span>
                            <span className="text-zinc-900 dark:text-white font-bold">₹{order.totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </div>
                        </div>

                        {/* Active Status pill */}
                        <div>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            order.status === 'delivered'
                              ? 'bg-emerald-500 text-white'
                              : order.status === 'cancelled'
                              ? 'bg-rose-500 text-white'
                              : 'bg-zinc-800 text-white'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>

                      {/* Purchased products thumbnail lists */}
                      <div className="space-y-3.5">
                        {order.orderItems.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4 text-xs font-semibold">
                            <div className="h-10 w-10 bg-white dark:bg-zinc-800 rounded-xl p-1 border border-zinc-200/50 flex items-center justify-center">
                              <img
                                src={item.image}
                                alt={item.name}
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).onerror = null;
                                  (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=100&auto=format&fit=crop&q=80';
                                }}
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                            <span className="text-zinc-700 dark:text-zinc-300 flex-1 line-clamp-1">{item.name} <span className="text-zinc-400 ml-1">x{item.quantity}</span></span>
                            <span className="text-zinc-900 dark:text-white font-bold">₹{(item.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </div>
                        ))}
                      </div>

                      {/* Delivery tracking controls */}
                      <div className="mt-5 pt-4 border-t border-zinc-200/50 dark:border-zinc-800/50 flex justify-between items-center flex-wrap gap-2">
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                          Payment: <span className="text-emerald-500 font-black">{order.paymentStatus}</span>
                        </span>
                        <button
                          onClick={() => setExpandedOrderId(expandedOrderId === (order.id || order._id) ? null : (order.id || order._id))}
                          className="px-4 py-1.5 text-[10px] font-black uppercase tracking-wider bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
                        >
                          {expandedOrderId === (order.id || order._id) ? 'Hide Tracking Map' : 'Track Delivery Route'}
                        </button>
                      </div>

                      {expandedOrderId === (order.id || order._id) && (
                        <div className="mt-4 border-t border-zinc-100 dark:border-zinc-800/60 pt-4">
                          <DeliveryTracker order={order} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ADDRESSES TAB */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-extrabold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                  Your Shipping Coordinates
                </h2>
                {!showAddressForm && (
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-sm transition-all active:scale-95"
                  >
                    + Add New Address
                  </button>
                )}
              </div>

              {showAddressForm && (
                <AddressForm onSubmit={handleSaveAddress} onCancel={() => setShowAddressForm(false)} />
              )}

              {loading ? (
                <div className="text-center py-12">
                  <div className="h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-xs text-zinc-500">Querying coordinates book...</p>
                </div>
              ) : myAddresses.length === 0 ? (
                <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-900/40 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-lg mx-auto">
                  <p className="text-xs text-zinc-500 font-medium">No saved addresses on file.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myAddresses.map((addr) => (
                    <div
                      key={addr.id || addr._id}
                      className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/50 p-5 rounded-3xl flex items-start justify-between gap-4 hover:shadow-sm"
                    >
                      <div className="text-xs font-semibold leading-relaxed">
                        <p className="text-zinc-900 dark:text-white font-extrabold mb-1 flex items-center gap-1.5">
                          Shipping Address {addr.isDefault && <span className="bg-emerald-500 text-white text-[8px] px-1.5 py-0.5 rounded uppercase font-extrabold">Default</span>}
                        </p>
                        <p className="text-zinc-600 dark:text-zinc-400">{addr.street}</p>
                        <p className="text-zinc-600 dark:text-zinc-400">{addr.city}, {addr.state} {addr.zipCode}</p>
                        <p className="text-zinc-500 mt-1">{addr.country}</p>
                      </div>

                      <button
                        onClick={() => handleDeleteAddress(addr.id || addr._id || '')}
                        className="p-2 text-zinc-400 hover:text-rose-500 rounded-full hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                        title="Delete Address"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
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
