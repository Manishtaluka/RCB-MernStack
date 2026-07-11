import api from "./axiosClient.js";

export const registerUser = (payload) => api.post("/auth/register", payload);

export const loginUser = (payload) => api.post("/auth/login", payload);

export const logoutUser = () => api.post("/auth/logout");

export const fetchMe = () => api.get("/auth/me");

// Called once on app load to silently restore a session from the
// httpOnly refresh cookie, without requiring the person to log in again.
export const refreshSession = () => api.post("/auth/refresh");
