export default function Hero() {
  return (
    <section className="relative h-[500px] bg-[url('/hero.jpg')] bg-cover bg-center">
      <div className="absolute inset-0 bg-blue-600/60 flex items-center px-16">
        <div className="text-white max-w-xl">
          <h1 className="text-5xl font-bold mb-4">
            New Collection 2026
          </h1>

          <p className="text-xl mb-6">
            Discover the latest trends
          </p>

          <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold">
            Shop Now
          </button>
        </div>
      </div>
    </section>
  );
}
