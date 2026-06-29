import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Import Views
import HomeView from './pages/HomeView';
import ShopView from './pages/ShopView';
import ProductDetailsView from './pages/ProductDetailsView';
import CartView from './pages/CartView';
import CheckoutView from './pages/CheckoutView';
import AuthView from './pages/AuthView';
import DashboardView from './pages/DashboardView';
import AdminView from './pages/AdminView';
import SellerView from './pages/SellerView';
import PaymentGatewayView from './pages/PaymentGatewayView';

// Import Static Views
import { AboutView, ContactView, OrderSuccessView, WishlistView } from './pages/StaticViews';

function AppContent() {
  const { theme } = useApp();
  const [currentView, setCurrentView] = useState('home');
  const [activeId, setActiveId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleNavigate = (view: string, id?: string) => {
    setCurrentView(view);
    if (id) {
      setActiveId(id);
    }
    // Scroll to top automatically
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderActiveView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView onNavigate={handleNavigate} onSearch={setSearchTerm} />;
      case 'shop':
        return <ShopView onNavigate={handleNavigate} searchTerm={searchTerm} onSearch={setSearchTerm} />;
      case 'product-details':
        return <ProductDetailsView productId={activeId} onNavigate={handleNavigate} />;
      case 'cart':
        return <CartView onNavigate={handleNavigate} />;
      case 'checkout':
        return <CheckoutView onNavigate={handleNavigate} />;
      case 'payment-gateway':
        return <PaymentGatewayView orderId={activeId} onNavigate={handleNavigate} />;
      case 'login':
        return <AuthView onNavigate={handleNavigate} defaultMode="login" />;
      case 'register':
        return <AuthView onNavigate={handleNavigate} defaultMode="register" />;
      case 'user-dashboard':
        return <DashboardView onNavigate={handleNavigate} />;
      case 'admin-dashboard':
        return <AdminView onNavigate={handleNavigate} />;
      case 'seller-dashboard':
        return <SellerView onNavigate={handleNavigate} />;
      case 'about':
        return <AboutView onNavigate={handleNavigate} />;
      case 'contact':
        return <ContactView />;
      case 'order-success':
        return <OrderSuccessView orderId={activeId} onNavigate={handleNavigate} />;
      case 'wishlist':
        return <WishlistView onNavigate={handleNavigate} />;
      default:
        return <HomeView onNavigate={handleNavigate} onSearch={setSearchTerm} />;
    }
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-zinc-950' : 'bg-white'}`}>
      <div className="bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-100 min-h-screen flex flex-col transition-colors duration-300">
        <Navbar onNavigate={handleNavigate} onSearch={setSearchTerm} currentView={currentView} />
        <main className="flex-grow">
          {renderActiveView()}
        </main>
        <Footer onNavigate={handleNavigate} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
