"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Navbar from "../../../components/Navbar";
import { useCart } from "../../context/CartContext";
import { Star } from "lucide-react";

export default function ProductDetail() {
  const params = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:5000/api/products/${params.id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err));
  }, [params.id]);

  if (!product) return <p className="p-8">Loading...</p>;

  return (
    <>
      <Navbar />

      <main className="px-10 py-10 bg-gray-50 min-h-screen">
        <div className="grid md:grid-cols-2 gap-12 bg-white p-8 rounded-2xl shadow">

          {/* Product Image */}
          <div className="h-[400px] bg-gray-200 rounded-xl" />

          {/* Product Info */}
          <div>
            <h1 className="text-4xl font-bold mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-1 text-yellow-500 mb-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={18} fill="currentColor" />
              ))}
              <span className="ml-2 text-gray-600">(4.8)</span>
            </div>

            <p className="text-3xl font-bold text-blue-600 mb-4">
              ${product.price}
            </p>

            <p className="text-gray-600 mb-6">
              {product.description}
            </p>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="font-semibold">Quantity:</span>

              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-4 py-2"
                >
                  -
                </button>

                <span className="px-4">{qty}</span>

                <button
                  onClick={() => setQty(qty + 1)}
                  className="px-4 py-2"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={() => addToCart({ ...product, qty })}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg"
            >
              Add to Cart
            </button>
          </div>

        </div>
      </main>
    </>
  );
}
