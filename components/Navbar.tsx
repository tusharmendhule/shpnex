"use client";

import Link from "next/link";
import { ShoppingCart, Search } from "lucide-react";
import { useCart } from "../app/context/CartContext";
import { useAuth } from "../app/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Navbar() {
  const { cart } = useCart();
  const { user } = useAuth();

  // total cart quantity
  const cartCount = cart.reduce(
    (sum: number, item: any) => sum + item.quantity,
    0
  );

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="flex items-center justify-between px-8 py-4">

        {/* Logo */}
        <Link href="/">
          <h1 className="text-2xl font-bold text-blue-600 cursor-pointer">
            Shopnex
          </h1>
        </Link>

        {/* Search */}
        <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-1/2">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            placeholder="Search products..."
            className="bg-transparent outline-none ml-2 w-full"
          />
        </div>

        {/* Right menu */}
        <div className="flex items-center gap-6">

          <Link href="/shop" className="text-gray-700 font-medium">
            Products
          </Link>


          <Link href="/orders" className="text-gray-700 font-medium">
            Orders
          </Link>


          {/* Cart */}
          <Link href="/cart" className="relative">
            <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-blue-600 cursor-pointer" />

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Auth button */}
          {user ? (
           <>
            <Link href="/profile" className="font-medium">
               Profile
            </Link>

            <button
              onClick={handleLogout}
              className="bg-gray-200 px-4 py-2 rounded-lg"
            >
             Logout
            </button>
            </>
            ) : (
            <Link
              href="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
            Sign In
            </Link>
            )}
        </div>
      </div>
    </header>
  );
}
