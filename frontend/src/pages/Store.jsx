import { useEffect, useState } from "react";
import { fetchProducts } from "../api/productsApi.js";
import ProductCard from "../components/ProductCard.jsx";

const categories = [
  { value: "", label: "All" },
  { value: "jersey", label: "Jerseys" },
  { value: "cap", label: "Caps" },
  { value: "accessories", label: "Accessories" },
  { value: "merchandise", label: "Merchandise" },
  { value: "collectibles", label: "Collectibles" },
];

export default function Store() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    fetchProducts(category ? { category } : {})
      .then(({ data }) => {
        if (!cancelled) setProducts(data);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load the store right now. Try again in a moment.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [category]);

  return (
    <div className="container mx-auto pt-28 pb-16">
      <h1 className="font-poppins font-bold text-white text-4xl text-center mb-8">
        RCB <span className="text-rcb-gold">Store</span>
      </h1>

      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {categories.map((c) => (
          <button
            key={c.value}
            onClick={() => setCategory(c.value)}
            className={`px-4 py-1.5 rounded-full font-poppins text-sm ${
              category === c.value
                ? "bg-rcb-gold text-black font-bold"
                : "text-white border border-white/30"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {loading && <p className="text-center text-white font-poppins">Loading products...</p>}
      {error && <p className="text-center text-red-400 font-poppins">{error}</p>}
      {!loading && !error && products.length === 0 && (
        <p className="text-center text-white/70 font-poppins">
          No products in this category yet.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
