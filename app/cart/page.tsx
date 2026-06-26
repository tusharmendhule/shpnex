"use client";

import Navbar from "../../components/Navbar";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export default function CartPage() {
  const { cart, addToCart, decreaseQuantity, removeFromCart } = useCart();
  const { user } = useAuth();

  // ✅ totals
  const subtotal = cart.reduce(
    (sum: number, item: CartItem) =>
      sum + item.price * item.quantity,
    0
  );

  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  // ✅ Save order to Firestore
  const saveOrder = async () => {
    if (!user) {
      alert("Please login first ❌");
      return;
    }

    try {
      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        items: cart,
        subtotal,
        total,
        createdAt: serverTimestamp(),
      });

      alert("Order saved successfully ✅");
    } catch (error) {
      console.error(error);
      alert("Failed to save order ❌");
    }
  };

  return (
    <>
      <Navbar />

      <main className="bg-gray-50 min-h-screen p-10 grid md:grid-cols-3 gap-8">

        {/* LEFT — Cart Items */}
        <div className="md:col-span-2 space-y-6">

          {cart.length === 0 ? (
            <div className="bg-white p-10 rounded-xl shadow text-center">
              <h2 className="text-xl font-semibold mb-2">
                Your cart is empty
              </h2>
              <p className="text-gray-500">
                Add some products to continue shopping
              </p>
            </div>
          ) : (
            cart.map((item: CartItem) => (
              <div
                key={item.id}
                className="bg-white p-6 rounded-xl shadow flex gap-6 items-center"
              >
                {/* Image */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />

                {/* Info */}
                <div className="flex-1">

                  <h2 className="font-semibold text-lg">
                    {item.name}
                  </h2>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 mt-3">

                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                    >
                      −
                    </button>

                    <span className="font-semibold">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => addToCart(item)}
                      className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                    >
                      +
                    </button>

                    <span className="font-bold ml-4">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-auto text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>

                  </div>
                </div>
              </div>
            ))
          )}

        </div>

        {/* RIGHT — Order Summary */}
        <div className="bg-white p-6 rounded-xl shadow h-fit">

          <h2 className="text-xl font-bold mb-6">
            Order Summary
          </h2>

          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between mb-2">
            <span>Shipping</span>
            <span>Free</span>
          </div>

          <div className="flex justify-between mb-4">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>

          <hr className="mb-4" />

          <div className="flex justify-between font-bold text-lg mb-6">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          {/* ✅ Save Order */}
          <button
            onClick={saveOrder}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg mb-3"
          >
            Save Order
          </button>

          <Link href="/checkout">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg mb-3">
              Proceed to Checkout
            </button>
          </Link>

          <Link href="/shop">
            <button className="w-full bg-gray-100 hover:bg-gray-200 py-3 rounded-lg">
              Continue Shopping
            </button>
          </Link>

        </div>

      </main>
    </>
  );
}
