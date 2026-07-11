import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { shippingSchema } from "../schemas/checkoutSchema.js";
import { createCheckoutOrder, verifyPayment } from "../api/ordersApi.js";
import { loadRazorpayScript } from "../utils/loadRazorpay.js";
import { clearCart, selectCartTotal } from "../redux/slices/cartSlice.js";

const fields = [
  { name: "fullName", label: "Full name" },
  { name: "phone", label: "Phone number" },
  { name: "addressLine", label: "Address" },
  { name: "city", label: "City" },
  { name: "state", label: "State" },
  { name: "pincode", label: "Pincode" },
];

export default function Checkout() {
  const items = useSelector((s) => s.cart.items);
  const total = useSelector(selectCartTotal);
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [status, setStatus] = useState(""); // "", "processing", "error"
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(shippingSchema) });

  const onSubmit = async (shippingAddress) => {
    setStatus("processing");
    setErrorMsg("");

    try {
      const { data: orderData } = await createCheckoutOrder({
        items: items.map((i) => ({
          productId: i.productId,
          size: i.size,
          quantity: i.quantity,
        })),
        shippingAddress,
      });

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Couldn't load the payment gateway. Check your connection and retry.");
      }

      const razorpay = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "RCB Store",
        description: "Merchandise purchase",
        order_id: orderData.razorpayOrderId,
        prefill: { name: user?.name, email: user?.email },
        theme: { color: "#ada15d" },
        handler: async (response) => {
          try {
            await verifyPayment({
              orderId: orderData.orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            dispatch(clearCart());
            navigate("/account", { state: { orderPlaced: true } });
          } catch {
            setStatus("error");
            setErrorMsg("Payment succeeded but verification failed. Contact support with your payment ID.");
          }
        },
        modal: {
          ondismiss: () => setStatus(""),
        },
      });

      razorpay.open();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.response?.data?.message || err.message || "Checkout failed. Please try again.");
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto pt-32 pb-16 text-center min-h-[50vh]">
        <p className="text-white font-poppins text-xl">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto pt-28 pb-16 max-w-xl">
      <h1 className="font-poppins font-bold text-white text-4xl text-center mb-8">
        Shipping <span className="text-rcb-gold">Details</span>
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-black/50 backdrop-blur rounded-lg p-8 space-y-4"
        noValidate
      >
        {fields.map(({ name, label }) => (
          <div key={name}>
            <label className="text-white font-poppins text-sm block mb-1">{label}</label>
            <input
              {...register(name)}
              className="w-full rounded px-3 py-2 bg-white/90 font-poppins outline-none focus:ring-2 focus:ring-rcb-gold"
            />
            {errors[name] && (
              <p className="text-red-400 text-xs mt-1 font-poppins">{errors[name].message}</p>
            )}
          </div>
        ))}

        <div className="flex items-center justify-between pt-2 border-t border-white/20">
          <span className="font-poppins font-bold text-white">
            Total: <span className="text-rcb-gold">₹{total}</span>
          </span>
        </div>

        {status === "error" && <p className="text-red-400 text-sm font-poppins">{errorMsg}</p>}

        <button
          type="submit"
          disabled={status === "processing"}
          className="w-full bg-rcb-gold text-black font-poppins font-bold italic py-2 rounded disabled:opacity-60"
        >
          {status === "processing" ? "Processing..." : "Pay now"}
        </button>
      </form>
    </div>
  );
}
