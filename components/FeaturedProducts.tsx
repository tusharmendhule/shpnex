import ProductCard from "./ProductCard";

export default function FeaturedProducts({ products }: any) {
  return (
    <section className="px-10 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Featured Products</h2>
        <span className="text-blue-600 cursor-pointer">View All</span>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        {products.map((p: any) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </section>
  );
}
