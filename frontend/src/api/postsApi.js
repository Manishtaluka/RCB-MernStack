import api from "./axiosClient.js";

export const fetchPosts = (params) => api.get("/posts", { params });

export const fetchPostBySlug = (slug) => api.get(`/posts/${slug}`);

// Admin only
export const fetchAllPostsAdmin = () => api.get("/posts/admin/all");
export const createPost = (payload) => api.post("/posts", payload);
export const updatePost = (id, payload) => api.put(`/posts/${id}`, payload);
export const deletePost = (id) => api.delete(`/posts/${id}`);
export const uploadCoverImage = (file) => {
  const formData = new FormData();
  formData.append("image", file);
  return api.post("/posts/upload-cover", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
