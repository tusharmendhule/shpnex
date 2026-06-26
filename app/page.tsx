// "use client";

// import { mockProducts } from "../data/products";

// import Navbar from "../components/Navbar";
// import Hero from "../components/Hero";
// import Categories from "../components/Categories";
// import FeaturedProducts from "../components/FeaturedProducts";
// import FooterCTA from "../components/FooterCTA";

// export default function Home() {
//   const products = mockProducts;

//   return (
//     <>
//       <Navbar />
//       <Hero />
//       <Categories />
//       <FeaturedProducts products={products} />
//       <FooterCTA />
//     </>
//   );
// }







"use client";

import products from "../data/products.json";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import FeaturedProducts from "../components/FeaturedProducts";
import FooterCTA from "../components/FooterCTA";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Categories />
      <FeaturedProducts products={products} />
      <FooterCTA />
    </>
  );
}
