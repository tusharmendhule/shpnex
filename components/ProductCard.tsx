"use client";

import { Star } from "lucide-react";
import { useCart } from "../app/context/CartContext";
import Link from "next/link";

type Product = {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  image: string;
  rating?: number;
};

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    addToCart({
      id: product._id ?? product.id ?? "",
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  return (
    <Link href={`/product/${product._id ?? product.id ?? ""}`}>
      <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden cursor-pointer">

        <img
          src={product.image}
          alt={product.name}
          className="h-56 w-full object-cover"
        />

        <div className="p-4">
          <h3 className="font-semibold mb-2">{product.name}</h3>

          <div className="flex items-center gap-1 text-yellow-500 text-sm mb-2">
            <Star size={16} fill="currentColor" />
            <span>{product.rating ?? 4.5}</span>
          </div>

          <p className="text-xl font-bold mb-4">
            ${product.price}
          </p>

          <button
            onClick={handleAddToCart}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
          >
            Add to Cart
          </button>
        </div>

      </div>
    </Link>
  );
}