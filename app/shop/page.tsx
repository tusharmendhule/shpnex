// "use client";

// import { useEffect, useMemo, useState } from "react";
// import Navbar from "../../components/Navbar";
// import ProductCard from "../../components/ProductCard";
// import productsData from "../../data/products.json";
// import { useSearchParams } from "next/navigation";


// export default function ShopPage() {
//   const [products, setProducts] = useState<any[]>([]);
//   const searchParams = useSearchParams();
//   const categoryFromURL = searchParams.get("category");

//   const [selectedCategory, setSelectedCategory] =
//   useState(categoryFromURL || "All Products");

//   const [maxPrice, setMaxPrice] = useState(3000);
//   const [sort, setSort] = useState("Featured");
//   const [loading, setLoading] = useState(true);

//   const categories = [
//     "All Products",
//     "electronics",
//     "fashion",
//     "home",
//     "sports",
//     "gaming",
//     "audio",
//     "wearables",
//   ];

//   const categoryMap: any = {
//   Electronics: "electronics",
//   Fashion: "fashion",
//   "Home & Living": "home",
//   Sports: "sports",
//   Gaming: "gaming",
//   Audio: "audio",
//   Wearables: "wearables",
// };


//   // Load from local JSON instead of API
//   useEffect(() => {
//     setProducts(productsData as any[]);
//     setLoading(false);
//   }, []);

//   // Filter + Sort
//   const filteredProducts = useMemo(() => {
//     let data = [...products];

//     if (selectedCategory !== "All Products") {
//       data = data.filter(
//         (p: any) =>
//           p.category?.toLowerCase() ===
//           selectedCategory.toLowerCase()
//       );
//     }

//     data = data.filter((p: any) => p.price <= maxPrice);

//     if (sort === "Price: Low to High") {
//       data.sort((a: any, b: any) => a.price - b.price);
//     } else if (sort === "Price: High to Low") {
//       data.sort((a: any, b: any) => b.price - a.price);
//     }

//     return data;
//   }, [products, selectedCategory, maxPrice, sort]);

//   return (
//     <>
//       <Navbar />

//       <main className="px-10 py-8 bg-gray-50 min-h-screen">
//         <h1 className="text-4xl font-bold mb-2">All Products</h1>

//         <p className="text-gray-500 mb-8">
//           {loading
//             ? "Loading..."
//             : `${filteredProducts.length} products found`}
//         </p>

//         <div className="grid grid-cols-4 gap-8">
//           {/* Filters */}
//           <aside className="bg-white p-6 rounded-xl shadow h-fit">
//             <h2 className="font-bold mb-4">Filters</h2>

//             <div className="mb-6">
//               <h3 className="font-semibold mb-2">
//                 Categories
//               </h3>

//               {categories.map((cat) => (
//                 <label key={cat} className="block mb-1">
//                   <input
//                     type="radio"
//                     name="cat"
//                     className="mr-2"
//                     checked={
//                       selectedCategory === categoryMap[cat] ||
//                       (cat === "All Products" &&
//                       selectedCategory === "All Products")
//                     }

//                     onChange={() =>
//                         setSelectedCategory(categoryMap[cat] || "All Products")
//                     }
//                   />
//                   {cat}
//                 </label>
//               ))}
//             </div>

//             <div>
//               <h3 className="font-semibold mb-2">
//                 Price Range
//               </h3>

//               <input
//                 type="range"
//                 min="0"
//                 max="3000"
//                 value={maxPrice}
//                 onChange={(e) =>
//                   setMaxPrice(Number(e.target.value))
//                 }
//                 className="w-full"
//               />

//               <div className="flex justify-between text-sm mt-1">
//                 <span>$0</span>
//                 <span>${maxPrice}</span>
//               </div>
//             </div>
//           </aside>

//           {/* Products */}
//           <section className="col-span-3">
//             <div className="flex justify-end mb-6">
//               <select
//                 className="border p-2 rounded-lg"
//                 value={sort}
//                 onChange={(e) => setSort(e.target.value)}
//               >
//                 <option>Featured</option>
//                 <option>Price: Low to High</option>
//                 <option>Price: High to Low</option>
//               </select>
//             </div>

//             <div className="grid md:grid-cols-3 gap-8">
//               {filteredProducts.map((p: any) => (
//                 <ProductCard key={p._id} product={p} />
//               ))}
//             </div>
//           </section>
//         </div>
//       </main>
//     </>
//   );
// }






"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import ProductCard from "../../components/ProductCard";
import productsData from "../../data/products.json";

export default function ShopPage() {
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

  // Sync URL category with state
  useEffect(() => {
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    }
  }, [urlCategory]);

  // Load products from JSON
  useEffect(() => {
    setProducts(productsData as any[]);
    setLoading(false);
  }, []);

  // Filter + sort logic
  const filteredProducts = useMemo(() => {
    let data = [...products];

    if (selectedCategory !== "all") {
      data = data.filter(
        (p: any) => p.category === selectedCategory
      );
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

      <main className="px-10 py-8 bg-gray-50 min-h-screen">
        <h1 className="text-4xl font-bold mb-2">
          All Products
        </h1>

        <p className="text-gray-500 mb-8">
          {loading
            ? "Loading..."
            : `${filteredProducts.length} products found`}
        </p>

        <div className="grid grid-cols-4 gap-8">
          {/* Filters */}
          <aside className="bg-white p-6 rounded-xl shadow h-fit">
            <h2 className="font-bold mb-4">Filters</h2>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">
                Categories
              </h3>

              {categories.map((cat) => (
                <label key={cat.value} className="block mb-1">
                  <input
                    type="radio"
                    name="cat"
                    className="mr-2"
                    checked={
                      selectedCategory === cat.value
                    }
                    onChange={() =>
                      setSelectedCategory(cat.value)
                    }
                  />
                  {cat.label}
                </label>
              ))}
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                Price Range
              </h3>

              <input
                type="range"
                min="0"
                max="3000"
                value={maxPrice}
                onChange={(e) =>
                  setMaxPrice(Number(e.target.value))
                }
                className="w-full"
              />

              <div className="flex justify-between text-sm mt-1">
                <span>$0</span>
                <span>${maxPrice}</span>
              </div>
            </div>
          </aside>

          {/* Products */}
          <section className="col-span-3">
            <div className="flex justify-end mb-6">
              <select
                className="border p-2 rounded-lg"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option>Featured</option>
                <option>
                  Price: Low to High
                </option>
                <option>
                  Price: High to Low
                </option>
              </select>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {filteredProducts.map((p: any) => (
                <ProductCard
                  key={p._id}
                  product={p}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
