import { useEffect, useState } from "react";
import {
  fetchAllPostsAdmin,
  createPost,
  updatePost,
  deletePost,
  uploadCoverImage,
} from "../../api/postsApi.js";

const emptyForm = {
  title: "",
  excerpt: "",
  content: "",
  tags: "",
  coverImage: "",
  isPublished: true,
};

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const load = () => {
    setLoading(true);
    fetchAllPostsAdmin()
      .then(({ data }) => setPosts(data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleEdit = (post) => {
    setEditingId(post._id);
    setForm({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      tags: (post.tags || []).join(", "),
      coverImage: post.coverImage || "",
      isPublished: post.isPublished,
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this post?")) return;
    await deletePost(id);
    load();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMessage("");
    try {
      const { data } = await uploadCoverImage(file);
      setForm((f) => ({ ...f, coverImage: data.url }));
    } catch (err) {
      setMessage(err.response?.data?.message || "Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const payload = {
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      coverImage: form.coverImage,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      isPublished: form.isPublished,
    };

    try {
      if (editingId) {
        await updatePost(editingId, payload);
        setMessage("Post updated.");
      } else {
        await createPost(payload);
        setMessage("Post created.");
      }
      resetForm();
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="font-poppins font-bold text-white text-2xl mb-6">
        {editingId ? "Edit Post" : "New Post"}
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 mb-10">
        <input
          required
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="rounded px-3 py-2 bg-white/90 font-poppins"
        />
        <textarea
          required
          maxLength={300}
          placeholder="Excerpt (max 300 chars)"
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          className="rounded px-3 py-2 bg-white/90 font-poppins"
          rows={2}
        />
        <textarea
          required
          placeholder="Full article content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="rounded px-3 py-2 bg-white/90 font-poppins"
          rows={8}
        />
        <input
          placeholder="Tags, comma separated (match-report, transfer-news)"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
          className="rounded px-3 py-2 bg-white/90 font-poppins"
        />

        <div>
          <label className="font-poppins text-white text-sm block mb-2">Cover image</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="text-white text-sm" />
          {uploading && <p className="text-white/60 text-xs font-poppins mt-1">Uploading...</p>}
          {form.coverImage && (
            <img src={form.coverImage} alt="Cover preview" className="h-32 mt-3 rounded" />
          )}
        </div>

        <label className="flex items-center gap-2 font-poppins text-white text-sm">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
          />
          Published (unchecked = draft)
        </label>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving || uploading}
            className="bg-rcb-gold text-black font-poppins font-bold italic px-6 py-2 rounded disabled:opacity-60"
          >
            {saving ? "Saving..." : editingId ? "Update post" : "Create post"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-white/70 font-poppins text-sm underline"
            >
              Cancel edit
            </button>
          )}
        </div>
        {message && <p className="text-rcb-gold font-poppins text-sm">{message}</p>}
      </form>

      <h2 className="font-poppins font-bold text-white text-xl mb-4">
        All Posts ({posts.length})
      </h2>

      {loading ? (
        <p className="text-white font-poppins">Loading...</p>
      ) : (
        <div className="space-y-2">
          {posts.map((p) => (
            <div
              key={p._id}
              className="flex items-center justify-between bg-white/5 rounded px-4 py-2"
            >
              <div>
                <p className="font-poppins font-bold text-white">
                  {p.title}{" "}
                  {!p.isPublished && (
                    <span className="text-xs text-yellow-400 font-normal">(draft)</span>
                  )}
                </p>
                <p className="font-poppins text-white/50 text-xs">/{p.slug}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(p)}
                  className="text-rcb-gold font-poppins text-sm underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="text-red-400 font-poppins text-sm underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
