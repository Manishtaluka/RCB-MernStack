import { useEffect, useState } from "react";
import { fetchProducts, createProduct, updateProduct, deleteProduct } from "../../api/productsApi.js";

const emptyForm = {
  name: "",
  description: "",
  category: "merchandise",
  price: "",
  discountPrice: "",
  stock: "",
  sizes: "",
  images: "",
  isFeatured: false,
};

const categories = ["jersey", "cap", "accessories", "merchandise", "collectibles"];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const load = () => {
    setLoading(true);
    fetchProducts()
      .then(({ data }) => setProducts(data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      discountPrice: product.discountPrice || "",
      stock: product.stock,
      sizes: (product.sizes || []).join(", "),
      images: (product.images || []).join(", "),
      isFeatured: product.isFeatured,
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await deleteProduct(id);
    load();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const payload = {
      name: form.name,
      description: form.description,
      category: form.category,
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
      stock: Number(form.stock),
      sizes: form.sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      images: form.images
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      isFeatured: form.isFeatured,
    };

    try {
      if (editingId) {
        await updateProduct(editingId, payload);
        setMessage("Product updated.");
      } else {
        await createProduct(payload);
        setMessage("Product created.");
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
        {editingId ? "Edit Product" : "New Product"}
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <input
          required
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="rounded px-3 py-2 bg-white/90 font-poppins"
        />
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="rounded px-3 py-2 bg-white/90 font-poppins"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <textarea
          required
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="rounded px-3 py-2 bg-white/90 font-poppins md:col-span-2"
          rows={2}
        />
        <input
          required
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="rounded px-3 py-2 bg-white/90 font-poppins"
        />
        <input
          type="number"
          placeholder="Discount price (optional)"
          value={form.discountPrice}
          onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
          className="rounded px-3 py-2 bg-white/90 font-poppins"
        />
        <input
          required
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          className="rounded px-3 py-2 bg-white/90 font-poppins"
        />
        <input
          placeholder="Sizes, comma separated (S, M, L, XL)"
          value={form.sizes}
          onChange={(e) => setForm({ ...form, sizes: e.target.value })}
          className="rounded px-3 py-2 bg-white/90 font-poppins"
        />
        <input
          placeholder="Image URLs, comma separated"
          value={form.images}
          onChange={(e) => setForm({ ...form, images: e.target.value })}
          className="rounded px-3 py-2 bg-white/90 font-poppins md:col-span-2"
        />
        <label className="flex items-center gap-2 font-poppins text-white text-sm">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
          />
          Featured product
        </label>

        <div className="md:col-span-2 flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-rcb-gold text-black font-poppins font-bold italic px-6 py-2 rounded disabled:opacity-60"
          >
            {saving ? "Saving..." : editingId ? "Update product" : "Create product"}
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
        {message && <p className="md:col-span-2 text-rcb-gold font-poppins text-sm">{message}</p>}
      </form>

      <h2 className="font-poppins font-bold text-white text-xl mb-4">
        Existing Products ({products.length})
      </h2>

      {loading ? (
        <p className="text-white font-poppins">Loading...</p>
      ) : (
        <div className="space-y-2">
          {products.map((p) => (
            <div
              key={p._id}
              className="flex items-center justify-between bg-white/5 rounded px-4 py-2"
            >
              <div>
                <p className="font-poppins font-bold text-white">{p.name}</p>
                <p className="font-poppins text-white/50 text-xs">
                  {p.category} · ₹{p.discountPrice || p.price} · stock: {p.stock}
                </p>
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
