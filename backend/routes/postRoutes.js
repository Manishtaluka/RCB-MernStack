import express from "express";
import {
  getPosts,
  getPostBySlug,
  getAllPostsAdmin,
  createPost,
  updatePost,
  deletePost,
  uploadCoverImage,
} from "../controllers/postController.js";
import { protect, adminOnly } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/admin/all", protect, adminOnly, getAllPostsAdmin);
router.get("/:slug", getPostBySlug);
router.post("/", protect, adminOnly, createPost);
router.post("/upload-cover", protect, adminOnly, upload.single("image"), uploadCoverImage);
router.put("/:id", protect, adminOnly, updatePost);
router.delete("/:id", protect, adminOnly, deletePost);

export default router;
