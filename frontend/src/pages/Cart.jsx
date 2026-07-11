import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeFromCart, updateQuantity, selectCartTotal } from "../redux/slices/cartSlice.js";

export default function Cart() {
  const items = useSelector((s) => s.cart.items);
  const total = useSelector(selectCartTotal);
  const { isAuthenticated } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }
    navigate("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto pt-32 pb-16 text-center min-h-[50vh]">
        <h1 className="font-poppins font-bold text-white text-3xl mb-4">Your cart is empty</h1>
        <Link to="/store" className="text-rcb-gold font-poppins font-bold underline">
          Browse the store
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-28 pb-16 max-w-3xl">
      <h1 className="font-poppins font-bold text-white text-4xl text-center mb-8">
        Your <span className="text-rcb-gold">Cart</span>
      </h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.size}`}
            className="flex items-center gap-4 bg-black/50 backdrop-blur rounded-lg p-4"
          >
            <img
              src={item.image || "https://via.placeholder.com/100x100?text=RCB"}
              alt={item.name}
              className="h-20 w-20 object-cover rounded"
            />
            <div className="flex-1">
              <p className="font-poppins font-bold text-white">{item.name}</p>
              {item.size && <p className="font-poppins text-white/60 text-sm">Size: {item.size}</p>}
              <p className="font-poppins text-rcb-gold font-bold">₹{item.price}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  dispatch(
                    updateQuantity({
                      productId: item.productId,
                      size: item.size,
                      quantity: item.quantity - 1,
                    })
                  )
                }
                className="w-7 h-7 bg-white/10 text-white rounded font-bold"
              >
                −
              </button>
              <span className="text-white font-poppins w-6 text-center">{item.quantity}</span>
              <button
                onClick={() =>
                  dispatch(
                    updateQuantity({
                      productId: item.productId,
                      size: item.size,
                      quantity: item.quantity + 1,
                    })
                  )
                }
                className="w-7 h-7 bg-white/10 text-white rounded font-bold"
              >
                +
              </button>
            </div>

            <button
              onClick={() => dispatch(removeFromCart({ productId: item.productId, size: item.size }))}
              className="text-red-400 font-poppins text-sm ml-2"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between bg-black/50 backdrop-blur rounded-lg p-4">
        <span className="font-poppins font-bold text-white text-lg">
          Total: <span className="text-rcb-gold">₹{total}</span>
        </span>
        <button
          onClick={handleCheckout}
          className="bg-rcb-gold text-black font-poppins font-bold italic px-6 py-2 rounded"
        >
          Proceed to checkout
        </button>
      </div>
    </div>
  );
}
