import slugify from "slugify";
import streamifier from "streamifier";
import Post from "../models/Post.js";
import cloudinary from "../config/cloudinary.js";

// @route GET /api/posts  (public — published only, ?page=&limit=&tag=&search=)
export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const { tag, search } = req.query;

    const filter = { isPublished: true };
    if (tag) filter.tags = tag;
    if (search) filter.$text = { $search: search };

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .populate("author", "name")
        .sort({ publishedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Post.countDocuments(filter),
    ]);

    res.json({ posts, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/posts/:slug  (public)
export const getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug, isPublished: true }).populate(
      "author",
      "name"
    );
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/posts/admin/all  (admin only — includes unpublished drafts)
export const getAllPostsAdmin = async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "name").sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/posts  (admin only)
export const createPost = async (req, res) => {
  try {
    const { title, excerpt, content, tags, coverImage, isPublished } = req.body;
    const slug = slugify(title, { lower: true, strict: true });

    const existing = await Post.findOne({ slug });
    if (existing) return res.status(409).json({ message: "A post with this title already exists" });

    const post = await Post.create({
      title,
      slug,
      excerpt,
      content,
      coverImage,
      tags: tags || [],
      isPublished: isPublished ?? true,
      author: req.user._id,
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @route PUT /api/posts/:id  (admin only)
export const updatePost = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.title) updates.slug = slugify(updates.title, { lower: true, strict: true });

    const post = await Post.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @route DELETE /api/posts/:id  (admin only)
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/posts/upload-cover  (admin only, multipart/form-data field "image")
export const uploadCoverImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });

    const streamUpload = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "rcb-posts" },
          (error, result) => (result ? resolve(result) : reject(error))
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

    const result = await streamUpload();
    res.json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
