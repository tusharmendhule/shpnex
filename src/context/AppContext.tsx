import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Product, Category, Order, Coupon, CartItem, Address } from '../types.js';
import { auth, googleProvider, signInWithPopup, signOut } from '../lib/firebase.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

interface AppContextType {
  user: User | null;
  token: string | null;
  cart: CartItem[];
  wishlist: Product[];
  categories: Category[];
  products: Product[];
  orders: Order[];
  appliedCoupon: Coupon | null;
  theme: 'light' | 'dark';
  loading: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  register: (name: string, email: string, password: string, role?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (name: string, email: string, password?: string) => Promise<boolean>;
  fetchProducts: (filters?: { category?: string; search?: string; sort?: string }) => Promise<void>;
  fetchProductById: (id: string) => Promise<Product | null>;
  fetchCategories: () => Promise<void>;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  applyCoupon: (code: string) => Promise<string | null>; // Returns error message or null if success
  createOrder: (shippingAddress: Address, paymentMethod: string) => Promise<Order | null>;
  payOrder: (orderId: string, paymentId?: string) => Promise<boolean>;
  initiateStripeCheckout: (orderId: string) => Promise<{ success: boolean; url?: string; simulation?: boolean; message?: string }>;
  fetchMyOrders: () => Promise<Order[]>;
  fetchDashboardMetrics: () => Promise<any>;
  fetchAllOrders: () => Promise<Order[]>;
  fetchAllUsers: () => Promise<User[]>;
  updateOrderStatus: (orderId: string, status: string) => Promise<boolean>;
  createReview: (productId: string, rating: number, comment: string) => Promise<boolean>;
  deleteReview: (productId: string, reviewId: string) => Promise<boolean>;
  getAddresses: () => Promise<Address[]>;
  addAddress: (address: Address) => Promise<Address[]>;
  deleteAddress: (id: string) => Promise<Address[]>;
  dbStatus: { connected: boolean; mode: 'production' | 'mock'; message: string } | null;
  checkDbStatus: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');
  const [loading, setLoading] = useState<boolean>(false);
  const [dbStatus, setDbStatus] = useState<{ connected: boolean; mode: 'production' | 'mock'; message: string } | null>(null);

  const checkDbStatus = async () => {
    try {
      const res = await fetch('/api/db-status');
      const data = await res.json();
      if (data.success) {
        setDbStatus({
          connected: data.connected,
          mode: data.mode,
          message: data.message
        });
      }
    } catch (err) {
      console.error('Error fetching db status:', err);
    }
  };

  // Initialize Auth, Cart, Wishlist, and Theme from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('shpnex_user');
    const storedToken = localStorage.getItem('shpnex_token');
    const storedCart = localStorage.getItem('shpnex_cart');
    const storedWishlist = localStorage.getItem('shpnex_wishlist');
    const storedTheme = localStorage.getItem('shpnex_theme') as 'light' | 'dark' | null;

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedToken) setToken(storedToken);
    if (storedCart) setCart(JSON.parse(storedCart));
    if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
    if (storedTheme) {
      setThemeState(storedTheme);
    } else {
      setThemeState('light');
    }

    fetchCategories();
    fetchProducts();
    checkDbStatus();
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('shpnex_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('shpnex_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    localStorage.setItem('shpnex_theme', newTheme);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      try {
        // 1. Authenticate via Firebase Client SDK
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await userCredential.user.getIdToken();

        // 2. Exchange token with local backend server
        const res = await fetch('/api/auth/firebase-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }),
        });
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          setToken(data.token);
          localStorage.setItem('shpnex_user', JSON.stringify(data.user));
          localStorage.setItem('shpnex_token', data.token);
          setLoading(false);
          return true;
        }
      } catch (fbError) {
        console.warn('Firebase sign-in failed, trying backend direct authentication:', fbError);
      }

      // Fallback: Authenticate directly with the backend database
      const fallbackRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const fallbackData = await fallbackRes.json();
      if (fallbackData.success) {
        setUser(fallbackData.user);
        setToken(fallbackData.token);
        localStorage.setItem('shpnex_user', JSON.stringify(fallbackData.user));
        localStorage.setItem('shpnex_token', fallbackData.token);
        setLoading(false);
        return true;
      }

      setLoading(false);
      return false;
    } catch (err) {
      console.error('Firebase sign-in error:', err);
      setLoading(false);
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    setLoading(true);
    try {
      // 1. Authenticate via Google Popup
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      // 2. Exchange token with local backend server
      const res = await fetch('/api/auth/firebase-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('shpnex_user', JSON.stringify(data.user));
        localStorage.setItem('shpnex_token', data.token);
        setLoading(false);
        return true;
      }
      setLoading(false);
      return false;
    } catch (err) {
      console.error('Firebase Google sign-in error:', err);
      setLoading(false);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, role?: string): Promise<boolean> => {
    setLoading(true);
    try {
      try {
        // 1. Create account via Firebase Client SDK
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const idToken = await userCredential.user.getIdToken();

        // 2. Exchange token with local backend server to create/sync in database
        const res = await fetch('/api/auth/firebase-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken, role }),
        });
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          setToken(data.token);
          localStorage.setItem('shpnex_user', JSON.stringify(data.user));
          localStorage.setItem('shpnex_token', data.token);
          setLoading(false);
          return true;
        }
      } catch (fbError) {
        console.warn('Firebase registration failed, trying backend direct registration:', fbError);
      }

      // Fallback: Register directly with the backend database
      const fallbackRes = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      const fallbackData = await fallbackRes.json();
      if (fallbackData.success) {
        setUser(fallbackData.user);
        setToken(fallbackData.token);
        localStorage.setItem('shpnex_user', JSON.stringify(fallbackData.user));
        localStorage.setItem('shpnex_token', fallbackData.token);
        setLoading(false);
        return true;
      }

      setLoading(false);
      return false;
    } catch (err) {
      console.error('Firebase registration error:', err);
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    signOut(auth).catch(console.error);
    setUser(null);
    setToken(null);
    setCart([]);
    setWishlist([]);
    setAppliedCoupon(null);
    localStorage.removeItem('shpnex_user');
    localStorage.removeItem('shpnex_token');
  };

  const updateProfile = async (name: string, email: string, password?: string): Promise<boolean> => {
    if (!token) return false;
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (data.success) {
        const updatedUser = { ...user, ...data.user };
        setUser(updatedUser);
        localStorage.setItem('shpnex_user', JSON.stringify(updatedUser));
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const getAddresses = async (): Promise<Address[]> => {
    if (!token) return [];
    try {
      const res = await fetch('/api/auth/addresses', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      return data.addresses || [];
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const addAddress = async (address: Address): Promise<Address[]> => {
    if (!token) return [];
    try {
      const res = await fetch('/api/auth/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(address),
      });
      const data = await res.json();
      if (data.success && user) {
        const updatedUser = { ...user, addresses: data.addresses };
        setUser(updatedUser);
        localStorage.setItem('shpnex_user', JSON.stringify(updatedUser));
      }
      return data.addresses || [];
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const deleteAddress = async (id: string): Promise<Address[]> => {
    if (!token) return [];
    try {
      const res = await fetch(`/api/auth/addresses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && user) {
        const updatedUser = { ...user, addresses: data.addresses };
        setUser(updatedUser);
        localStorage.setItem('shpnex_user', JSON.stringify(updatedUser));
      }
      return data.addresses || [];
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const fetchProducts = async (filters?: { category?: string; search?: string; sort?: string }) => {
    setLoading(true);
    try {
      let url = '/api/products';
      const params = new URLSearchParams();
      if (filters?.category) params.append('category', filters.category);
      if (filters?.search) params.append('search', filters.search);
      if (filters?.sort) params.append('sort', filters.sort);

      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductById = async (id: string): Promise<Product | null> => {
    try {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      return data.success ? data.product : null;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addToCart = (product: Product, quantity: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id || item.product._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id || item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId && item.product._id !== productId));
  };

  const updateCartQty = (productId: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId || item.product._id === productId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id || p._id === product._id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id && p._id !== product._id);
      }
      return [...prev, product];
    });
  };

  const applyCoupon = async (code: string): Promise<string | null> => {
    if (!token) return 'Must be logged in to apply coupons.';
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon(data.coupon);
        return null; // Success
      }
      return data.message || 'Invalid coupon';
    } catch (err) {
      return 'Server error validating coupon';
    }
  };

  const createOrder = async (shippingAddress: Address, paymentMethod: string): Promise<Order | null> => {
    if (!token) return null;

    const itemsPrice = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const discountAmount = appliedCoupon ? (itemsPrice * appliedCoupon.discount) / 100 : 0;
    const shippingPrice = itemsPrice > 150 ? 0 : 15;
    const totalPrice = Math.max(0, itemsPrice - discountAmount + shippingPrice);

    const orderItems = cart.map((item) => ({
      product: item.product.id || item.product._id || '',
      name: item.product.name,
      price: item.product.price,
      image: item.product.image,
      quantity: item.quantity,
    }));

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderItems,
          shippingAddress,
          paymentMethod,
          itemsPrice,
          shippingPrice,
          totalPrice,
        }),
      });
      const data = await res.json();
      return data.success ? data.order : null;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const payOrder = async (orderId: string, paymentId?: string): Promise<boolean> => {
    if (!token) return false;
    try {
      const res = await fetch(`/api/orders/${orderId}/pay`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentId }),
      });
      const data = await res.json();
      return data.success;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const initiateStripeCheckout = async (orderId: string): Promise<{ success: boolean; url?: string; simulation?: boolean; message?: string }> => {
    if (!token) return { success: false, message: 'Not authenticated' };
    try {
      const res = await fetch('/api/payment/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      return data;
    } catch (err: any) {
      console.error('Stripe initiate error:', err);
      return { success: false, message: err.message || 'Payment initiation failed' };
    }
  };

  const fetchMyOrders = async (): Promise<Order[]> => {
    if (!token) return [];
    try {
      const res = await fetch('/api/orders/myorders', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      return data.success ? data.orders : [];
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const fetchDashboardMetrics = async (): Promise<any> => {
    if (!token) return null;
    try {
      const res = await fetch('/api/admin/analytics', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      return data.success ? data.analytics : null;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const fetchAllOrders = async (): Promise<Order[]> => {
    if (!token) return [];
    try {
      const res = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      return data.success ? data.orders : [];
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const fetchAllUsers = async (): Promise<User[]> => {
    if (!token) return [];
    try {
      const res = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      return data.success ? data.users : [];
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const updateOrderStatus = async (orderId: string, status: string): Promise<boolean> => {
    if (!token) return false;
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      return data.success;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const createReview = async (productId: string, rating: number, comment: string): Promise<boolean> => {
    if (!token) return false;
    try {
      const res = await fetch(`/api/reviews/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });
      const data = await res.json();
      // Reload product listing to show updated reviews
      fetchProducts();
      return data.success;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const deleteReview = async (productId: string, reviewId: string): Promise<boolean> => {
    if (!token) return false;
    try {
      const res = await fetch(`/api/reviews/${productId}/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      // Reload product listing to show updated reviews
      fetchProducts();
      return data.success;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        token,
        cart,
        wishlist,
        categories,
        products,
        orders,
        appliedCoupon,
        theme,
        loading,
        setTheme,
        login,
        loginWithGoogle,
        register,
        logout,
        updateProfile,
        fetchProducts,
        fetchProductById,
        fetchCategories,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        toggleWishlist,
        applyCoupon,
        createOrder,
        payOrder,
        initiateStripeCheckout,
        fetchMyOrders,
        fetchDashboardMetrics,
        fetchAllOrders,
        fetchAllUsers,
        updateOrderStatus,
        createReview,
        deleteReview,
        getAddresses,
        addAddress,
        deleteAddress,
        dbStatus,
        checkDbStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside AppProvider');
  return context;
}
