"use client";

import Link from "next/link";

const categories = [
  { name: "All Products", value: "all" },
  { name: "Electronics", value: "electronics" },
  { name: "Fashion", value: "fashion" },
  { name: "Home & Living", value: "home" },
  { name: "Sports", value: "sports" },
  { name: "Gaming", value: "gaming" },
  { name: "Audio", value: "audio" },
  { name: "Wearables", value: "wearables" },
];

export default function Categories() {
  return (
    <section className="px-10 py-12 bg-gray-100">
      <h2 className="text-3xl font-bold mb-6">
        Shop by Category
      </h2>

      <div className="flex flex-wrap gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.value}
            href={`/shop?category=${cat.value}`}
            className="bg-white px-6 py-3 rounded-xl shadow hover:bg-blue-50 transition"
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
