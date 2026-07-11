import api from "./axiosClient.js";

export const fetchProducts = (params) => api.get("/products", { params });

export const fetchProductById = (id) => api.get(`/products/${id}`);

// Admin only
export const createProduct = (payload) => api.post("/products", payload);
export const updateProduct = (id, payload) => api.put(`/products/${id}`, payload);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
