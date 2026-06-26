"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import ProductCard from "../../components/ProductCard";
import productsData from "../../data/products.json";

function ShopContent() {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category");

  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(
    urlCategory || "all"
  );
  const [maxPrice, setMaxPrice] = useState(3000);
  const [sort, setSort] = useState("Featured");
  const [loading, setLoading] = useState(true);

  const categories = [
    { label: "All Products", value: "all" },
    { label: "Electronics", value: "electronics" },
    { label: "Fashion", value: "fashion" },
    { label: "Home & Living", value: "home" },
    { label: "Sports", value: "sports" },
    { label: "Gaming", value: "gaming" },
    { label: "Audio", value: "audio" },
    { label: "Wearables", value: "wearables" },
  ];

  useEffect(() => {
    if (urlCategory) setSelectedCategory(urlCategory);
  }, [urlCategory]);

  useEffect(() => {
    setProducts(productsData as any[]);
    setLoading(false);
  }, []);

  const filteredProducts = useMemo(() => {
    let data = [...products];

    if (selectedCategory !== "all") {
      data = data.filter((p: any) => p.category === selectedCategory);
    }

    data = data.filter((p: any) => p.price <= maxPrice);

    if (sort === "Price: Low to High") {
      data.sort((a: any, b: any) => a.price - b.price);
    } else if (sort === "Price: High to Low") {
      data.sort((a: any, b: any) => b.price - a.price);
    }

    return data;
  }, [products, selectedCategory, maxPrice, sort]);

  return (
    <>
      <Navbar />
      {/* Paste your existing JSX here unchanged */}
    </>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-10">Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}