"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import products from "@/data/products.json";
import Navbar from "../../../components/Navbar";
import { useCart } from "../../context/CartContext";

export default function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    const found = products.find((p: any) => p._id === id);
    setProduct(found);
  }, [id]);

  if (!product) {
    return <p className="p-10">Loading product...</p>;
  }

  return (
    <>
      <Navbar />

      <main className="p-10 bg-gray-50 min-h-screen grid md:grid-cols-2 gap-10">

        {/* Image */}
        <img
          src={product.image}
          alt={product.name}
          className="rounded-xl shadow"
        />

        {/* Info */}
        <div>
          <h1 className="text-3xl font-bold mb-4">
            {product.name}
          </h1>

          <p className="text-xl font-semibold mb-4">
            ${product.price}
          </p>

          <p className="text-gray-600 mb-6">
            {product.description}
          </p>

          <button
            onClick={() => addToCart(product)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Add to Cart
          </button>
        </div>

      </main>
    </>
  );
}
