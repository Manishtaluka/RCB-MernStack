import { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice.js";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const [size, setSize] = useState(product.sizes?.[0] || null);
  const price = product.discountPrice || product.price;
  const outOfStock = product.stock <= 0;

  const handleAdd = () => {
    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        price,
        image: product.images?.[0],
        size,
        quantity: 1,
        stock: product.stock,
      })
    );
  };

  return (
    <div className="bg-black/50 backdrop-blur rounded-lg overflow-hidden flex flex-col">
      <img
        src={product.images?.[0] || "https://via.placeholder.com/400x400?text=RCB"}
        alt={product.name}
        className="h-56 w-full object-cover"
      />
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-poppins font-bold text-white text-lg">{product.name}</h3>
        <p className="font-poppins text-white/60 text-xs mt-1 line-clamp-2">
          {product.description}
        </p>

        <div className="mt-2 flex items-center gap-2">
          <span className="font-poppins font-bold text-rcb-gold text-xl">₹{price}</span>
          {product.discountPrice && (
            <span className="font-poppins text-white/50 text-sm line-through">
              ₹{product.price}
            </span>
          )}
        </div>

        {product.sizes?.length > 0 && (
          <div className="flex gap-2 mt-3">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`px-2 py-1 text-xs font-poppins rounded border ${
                  size === s
                    ? "bg-rcb-gold text-black border-rcb-gold"
                    : "text-white border-white/30"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={handleAdd}
          disabled={outOfStock}
          className="mt-auto pt-4 w-full bg-rcb-gold text-black font-poppins font-bold italic py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {outOfStock ? "Out of stock" : "Add to cart"}
        </button>
      </div>
    </div>
  );
}
