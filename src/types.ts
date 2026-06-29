export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: 'customer' | 'seller' | 'admin' | 'user';
  addresses?: Address[];
  createdAt?: string;
}

export interface Address {
  id?: string;
  _id?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export interface Review {
  id: string;
  _id?: string;
  user: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Product {
  id: string;
  _id?: string;
  name: string;
  description: string;
  price: number;
  image: string;
  images?: string[];
  category: string;
  stock: number;
  rating: number;
  reviewsCount: number;
  reviews?: Review[];
  featured?: boolean;
  seller?: string;
}

export interface Category {
  id: string;
  _id?: string;
  name: string;
  slug: string;
  image: string;
}

export interface OrderItem {
  product: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Order {
  id: string;
  _id?: string;
  user: string;
  orderItems: OrderItem[];
  shippingAddress: Address;
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentId?: string;
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  deliveredAt?: string;
}

export interface Coupon {
  id: string;
  _id?: string;
  code: string;
  discount: number; // percentage
  expiryDate: string;
  active: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
