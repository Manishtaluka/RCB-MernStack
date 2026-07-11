import { useEffect, useState } from "react";
import { fetchAllOrders, updateOrderStatus } from "../../api/ordersApi.js";

const statuses = ["pending", "paid", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetchAllOrders()
      .then(({ data }) => setOrders(data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleStatusChange = async (id, status) => {
    await updateOrderStatus(id, status);
    load();
  };

  return (
    <div>
      <h1 className="font-poppins font-bold text-white text-2xl mb-6">
        Orders ({orders.length})
      </h1>

      {loading ? (
        <p className="text-white font-poppins">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-white/60 font-poppins">No orders placed yet.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order._id} className="bg-white/5 rounded p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div>
                  <p className="font-poppins font-bold text-white">
                    {order.user?.name} <span className="text-white/50 font-normal">({order.user?.email})</span>
                  </p>
                  <p className="font-poppins text-white/50 text-xs">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className="rounded px-2 py-1 bg-white/90 font-poppins text-sm"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="font-poppins text-white/80 text-sm space-y-1">
                {order.items.map((item, i) => (
                  <p key={i}>
                    {item.name} {item.size && `(${item.size})`} × {item.quantity} — ₹{item.price}
                  </p>
                ))}
              </div>

              <p className="font-poppins font-bold text-rcb-gold mt-2">
                Total: ₹{order.totalAmount}
              </p>
              <p className="font-poppins text-white/50 text-xs mt-1">
                {order.shippingAddress.fullName}, {order.shippingAddress.addressLine},{" "}
                {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                {order.shippingAddress.pincode}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
