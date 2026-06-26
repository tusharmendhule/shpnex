"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    card: "",
  });

  const total = cart.reduce(
    (sum: number, item: any) =>
      sum + item.price * item.quantity,
    0
  );

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const placeOrder = async () => {
  if (!form.name || !form.address || !form.card) {
    alert("Please fill all fields");
    return;
  }

  if (!user) {
    alert("Please login first");
    return;
  }

  try {
    await addDoc(collection(db, "orders"), {
      userId: user.uid,
      customer: form,
      items: cart,
      total,
      createdAt: serverTimestamp(),
    });

    clearCart();
    router.push("/success");

  } catch (err) {
    console.error(err);
    alert("Order failed ❌");
  }
};


  return (
    <>
      <Navbar />

      <main className="bg-gray-50 min-h-screen p-10 grid md:grid-cols-2 gap-10">

        {/* LEFT — Form */}
        <div className="bg-white p-8 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-6">
            Checkout
          </h2>

          <input
            name="name"
            placeholder="Full Name"
            className="w-full border p-3 mb-4 rounded"
            onChange={handleChange}
          />

          <input
            name="address"
            placeholder="Address"
            className="w-full border p-3 mb-4 rounded"
            onChange={handleChange}
          />

          <input
            name="city"
            placeholder="City"
            className="w-full border p-3 mb-4 rounded"
            onChange={handleChange}
          />

          <input
            name="card"
            placeholder="Card Number"
            className="w-full border p-3 mb-6 rounded"
            onChange={handleChange}
          />

          <button
            onClick={placeOrder}
            className="w-full bg-blue-600 text-white py-3 rounded-lg"
          >
            Place Order
          </button>
        </div>

        {/* RIGHT — Summary */}
        <div className="bg-white p-8 rounded-xl shadow h-fit">
          <h2 className="text-xl font-bold mb-6">
            Order Summary
          </h2>

          {cart.map((item: any) => (
            <div
              key={item.id}
              className="flex justify-between mb-2"
            >
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}

          <hr className="my-4" />

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

      </main>
    </>
  );
}
