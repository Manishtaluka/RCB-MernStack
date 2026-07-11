import api from "./axiosClient.js";

export const createCheckoutOrder = (payload) => api.post("/orders/checkout", payload);

export const verifyPayment = (payload) => api.post("/orders/verify", payload);

export const fetchMyOrders = () => api.get("/orders/mine");

// Admin only
export const fetchAllOrders = () => api.get("/orders");
export const updateOrderStatus = (id, status) => api.patch(`/orders/${id}/status`, { status });
