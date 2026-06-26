"use client";

import Navbar from "../../components/Navbar";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <>
      <Navbar />

      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">

        <h1 className="text-4xl font-bold mb-4">
          🎉 Order Placed!
        </h1>

        <p className="text-gray-600 mb-6">
          Thank you for shopping with us.
        </p>

        <Link
          href="/shop"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Continue Shopping
        </Link>

      </main>
    </>
  );
}
