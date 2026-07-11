import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchPostBySlug } from "../api/postsApi.js";

export default function PostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);

    fetchPostBySlug(slug)
      .then(({ data }) => {
        if (!cancelled) setPost(data);
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return <p className="text-center text-white font-poppins pt-32">Loading article...</p>;
  }

  if (notFound || !post) {
    return (
      <div className="container mx-auto pt-32 pb-16 text-center min-h-[50vh]">
        <p className="text-white font-poppins text-xl mb-4">Article not found.</p>
        <Link to="/news" className="text-rcb-gold font-poppins font-bold underline">
          Back to news
        </Link>
      </div>
    );
  }

  return (
    <article className="container mx-auto pt-28 pb-16 max-w-2xl">
      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-72 object-cover rounded-lg mb-8"
        />
      )}

      {post.tags?.length > 0 && (
        <div className="flex gap-2 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-poppins text-rcb-gold border border-rcb-gold/50 px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <h1 className="font-poppins font-bold text-white text-3xl md:text-4xl mb-3">{post.title}</h1>

      <p className="font-poppins text-white/50 text-sm mb-8">
        {post.author?.name && `By ${post.author.name} · `}
        {new Date(post.publishedAt).toLocaleDateString(undefined, { dateStyle: "long" })}
      </p>

      <div className="font-poppins text-white/90 leading-relaxed whitespace-pre-wrap">
        {post.content}
      </div>

      <Link
        to="/news"
        className="inline-block mt-10 text-rcb-gold font-poppins font-bold underline"
      >
        ← Back to news
      </Link>
    </article>
  );
}
