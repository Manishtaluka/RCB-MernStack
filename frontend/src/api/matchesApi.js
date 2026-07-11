import api from "./axiosClient.js";

export const fetchMatches = (state) => api.get("/matches", { params: state ? { state } : {} });

// Admin only
export const triggerMatchSync = () => api.post("/matches/sync");
