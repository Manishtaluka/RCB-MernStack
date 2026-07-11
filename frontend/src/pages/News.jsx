import { useEffect, useState } from "react";
import { fetchPosts } from "../api/postsApi.js";
import PostCard from "../components/PostCard.jsx";

export default function News() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    fetchPosts({ page, limit: 9, search: search || undefined })
      .then(({ data }) => {
        if (cancelled) return;
        setPosts(data.posts);
        setPages(data.pages);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load news right now.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  return (
    <div className="container mx-auto pt-28 pb-16">
      <h1 className="font-poppins font-bold text-white text-4xl text-center mb-8">
        RCB <span className="text-rcb-gold">News</span>
      </h1>

      <form onSubmit={handleSearch} className="flex justify-center gap-2 mb-10 max-w-md mx-auto">
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search articles..."
          className="flex-1 rounded px-3 py-2 bg-white/90 font-poppins outline-none focus:ring-2 focus:ring-rcb-gold"
        />
        <button
          type="submit"
          className="bg-rcb-gold text-black font-poppins font-bold italic px-4 py-2 rounded"
        >
          Search
        </button>
      </form>

      {loading && <p className="text-center text-white font-poppins">Loading news...</p>}
      {error && <p className="text-center text-red-400 font-poppins">{error}</p>}
      {!loading && !error && posts.length === 0 && (
        <p className="text-center text-white/70 font-poppins">No articles found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>

      {pages > 1 && (
        <div className="flex justify-center gap-3 mt-10">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-1.5 rounded font-poppins text-sm text-white border border-white/30 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="font-poppins text-white/70 text-sm self-center">
            Page {page} of {pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page === pages}
            className="px-4 py-1.5 rounded font-poppins text-sm text-white border border-white/30 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
