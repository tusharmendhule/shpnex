import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { ShoppingBag, Heart, User, Sun, Moon, Search, LogOut, LayoutDashboard, Menu, X, Database, ShieldAlert, CheckCircle, Info, RefreshCw } from 'lucide-react';

interface NavbarProps {
  onNavigate: (view: string) => void;
  onSearch: (term: string) => void;
  currentView: string;
}

export default function Navbar({ onNavigate, onSearch, currentView }: NavbarProps) {
  const { user, cart, wishlist, theme, setTheme, logout, dbStatus, checkDbStatus } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDbModal, setShowDbModal] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
    onNavigate('shop');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => { onNavigate('home'); setSearchTerm(''); onSearch(''); }}
              className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white hover:opacity-90 flex items-center gap-1.5 transition-all"
            >
              <span className="bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">Shp</span>
              <span className="text-zinc-900 dark:text-white">Nex</span>
            </button>

            {dbStatus && (
              <button
                onClick={() => setShowDbModal(true)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase border transition-all cursor-pointer select-none active:scale-95 ${
                  dbStatus.connected
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
                }`}
                title="View Database Status"
              >
                <span className={`h-1.5 w-1.5 rounded-full ${dbStatus.connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-pulse'}`}></span>
                <span>{dbStatus.connected ? 'Atlas' : 'Sandbox DB'}</span>
              </button>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => onNavigate('home')}
              className={`text-sm font-medium transition-colors ${currentView === 'home' ? 'text-emerald-500' : 'text-zinc-600 dark:text-zinc-300 hover:text-emerald-500 dark:hover:text-emerald-400'}`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('shop')}
              className={`text-sm font-medium transition-colors ${currentView === 'shop' ? 'text-emerald-500' : 'text-zinc-600 dark:text-zinc-300 hover:text-emerald-500 dark:hover:text-emerald-400'}`}
            >
              Shop
            </button>
            <button
              onClick={() => onNavigate('about')}
              className={`text-sm font-medium transition-colors ${currentView === 'about' ? 'text-emerald-500' : 'text-zinc-600 dark:text-zinc-300 hover:text-emerald-500 dark:hover:text-emerald-400'}`}
            >
              About
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className={`text-sm font-medium transition-colors ${currentView === 'contact' ? 'text-emerald-500' : 'text-zinc-600 dark:text-zinc-300 hover:text-emerald-500 dark:hover:text-emerald-400'}`}
            >
              Contact
            </button>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="hidden lg:block flex-1 max-w-md mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search premium apparel, tech & accessories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white pl-10 pr-4 py-2 rounded-full border-none focus:ring-2 focus:ring-emerald-500 outline-none text-sm transition-all placeholder-zinc-400"
              />
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-zinc-400" />
            </div>
          </form>

          {/* Icon controls */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-1.5 text-zinc-600 dark:text-zinc-300 hover:text-emerald-500 dark:hover:text-emerald-400 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>

            {/* Wishlist */}
            <button
              onClick={() => onNavigate('wishlist')}
              className="relative p-1.5 text-zinc-600 dark:text-zinc-300 hover:text-emerald-500 dark:hover:text-emerald-400 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-pulse">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => onNavigate('cart')}
              className="relative p-1.5 text-zinc-600 dark:text-zinc-300 hover:text-emerald-500 dark:hover:text-emerald-400 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account Dashboard/Login */}
            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-zinc-200 dark:border-zinc-800">
                <button
                  onClick={() => {
                    if (user.role === 'admin') {
                      onNavigate('admin-dashboard');
                    } else if (user.role === 'seller') {
                      onNavigate('seller-dashboard');
                    } else {
                      onNavigate('user-dashboard');
                    }
                  }}
                  className="flex items-center gap-2 hover:text-emerald-500 dark:hover:text-emerald-400 group transition-colors"
                >
                  <User className="h-5 w-5 text-zinc-600 dark:text-zinc-300 group-hover:text-emerald-500 dark:group-hover:text-emerald-400" />
                  <div className="flex flex-col items-start text-left">
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 leading-tight">
                      {user.name.split(' ')[0]}
                    </span>
                    <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      {user.role}
                    </span>
                  </div>
                </button>
                <button
                  onClick={logout}
                  className="p-1.5 text-zinc-400 hover:text-rose-500 rounded-full hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4.5 w-4.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 text-sm font-medium transition-all shadow-sm shadow-zinc-950/10 hover:shadow"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-4">
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-1.5 text-zinc-600 dark:text-zinc-300 rounded-full"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            <button
              onClick={() => onNavigate('cart')}
              className="relative p-1.5 text-zinc-600 dark:text-zinc-300"
            >
              <ShoppingBag className="h-5.5 w-5.5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-emerald-500 text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-zinc-600 dark:text-zinc-300"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-all">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {/* Search */}
            <form onSubmit={handleSearchSubmit} className="relative pb-2">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white pl-9 pr-4 py-1.5 rounded-full outline-none text-sm border-none focus:ring-1 focus:ring-emerald-500"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            </form>

            <button
              onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Home
            </button>
            <button
              onClick={() => { onNavigate('shop'); setMobileMenuOpen(false); }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Shop
            </button>
            <button
              onClick={() => { onNavigate('wishlist'); setMobileMenuOpen(false); }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Wishlist ({wishlist.length})
            </button>
            <button
              onClick={() => { onNavigate('about'); setMobileMenuOpen(false); }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              About
            </button>
            <button
              onClick={() => { onNavigate('contact'); setMobileMenuOpen(false); }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Contact
            </button>

            {user ? (
              <>
                <div className="border-t border-zinc-200 dark:border-zinc-800 my-2 pt-2"></div>
                <button
                  onClick={() => {
                    if (user.role === 'admin') {
                      onNavigate('admin-dashboard');
                    } else if (user.role === 'seller') {
                      onNavigate('seller-dashboard');
                    } else {
                      onNavigate('user-dashboard');
                    }
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-semibold text-emerald-500"
                >
                  Dashboard ({user.name})
                </button>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-rose-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => { onNavigate('login'); setMobileMenuOpen(false); }}
                className="block w-full text-center mt-4 px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}

      {/* Database Status Modal */}
      {showDbModal && dbStatus && (
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 transition-all">
          <div 
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-lg w-full shadow-2xl p-6 relative overflow-hidden transition-all animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-5">
              <div className={`p-2 rounded-lg ${dbStatus.connected ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
                <Database className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Database Control Center</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Manage connections and view server integration status</p>
              </div>
              <button 
                onClick={() => setShowDbModal(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Status Card */}
            <div className={`p-4 rounded-xl border mb-5 ${
              dbStatus.connected 
                ? 'bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900/30 text-emerald-900 dark:text-emerald-200' 
                : 'bg-amber-50/50 dark:bg-amber-950/10 border-amber-200 dark:border-amber-900/30 text-amber-900 dark:text-amber-200'
            }`}>
              <div className="flex gap-3">
                {dbStatus.connected ? (
                  <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                ) : (
                  <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-bold text-sm">
                    {dbStatus.connected ? 'Live Database Active' : 'Operating in Sandbox Mode'}
                  </h4>
                  <p className="text-xs mt-1 leading-relaxed opacity-90">
                    {dbStatus.connected 
                      ? 'Fully connected to your MongoDB Atlas cluster. All transactions, accounts, and product inventories are stored persistently.'
                      : 'The application is running using a local, in-memory mock database. Changes are stored temporarily and reset on server reload.'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Connection Guide (only if not connected) */}
            {!dbStatus.connected && (
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                  <Info className="h-4 w-4 text-amber-500" />
                  <span>MongoDB Connection Setup Guide</span>
                </div>
                
                <ol className="text-xs text-zinc-600 dark:text-zinc-400 space-y-3 pl-1">
                  <li className="flex gap-2">
                    <span className="flex items-center justify-center h-5 w-5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-700 dark:text-zinc-300 shrink-0">1</span>
                    <span className="leading-relaxed">
                      <strong>Deploy a Free Cluster</strong>: Visit <a href="https://www.mongodb.com/cloud/atlas" target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:underline">MongoDB Atlas</a>, sign up, and deploy a free shared database.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="flex items-center justify-center h-5 w-5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-700 dark:text-zinc-300 shrink-0">2</span>
                    <span className="leading-relaxed">
                      <strong>Get Connection URI</strong>: Click <em>Connect</em>, select <em>Drivers</em> (Node.js), and copy your connection string (looks like <code>mongodb+srv://...</code>).
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="flex items-center justify-center h-5 w-5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-700 dark:text-zinc-300 shrink-0">3</span>
                    <span className="leading-relaxed">
                      <strong>Add Environment Variable</strong>: In the Google AI Studio settings panel (or your <code>.env</code> file), add a new secret key named <code>MONGO_URI</code> and paste your connection string.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="flex items-center justify-center h-5 w-5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-700 dark:text-zinc-300 shrink-0">4</span>
                    <span className="leading-relaxed">
                      <strong>Re-Test</strong>: Click <strong>Test Connection</strong> below to verify the server successfully connects to MongoDB.
                    </span>
                  </li>
                </ol>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <button
                onClick={() => setShowDbModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
              >
                Close View
              </button>
              
              <button
                onClick={async () => {
                  setTestingConnection(true);
                  await checkDbStatus();
                  setTimeout(() => setTestingConnection(false), 800);
                }}
                disabled={testingConnection}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white transition-all cursor-pointer active:scale-95"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${testingConnection ? 'animate-spin' : ''}`} />
                <span>{testingConnection ? 'Verifying...' : 'Test Connection'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
