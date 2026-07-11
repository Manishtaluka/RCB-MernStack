import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  return (
    <Link
      to={`/news/${post.slug}`}
      className="bg-black/50 backdrop-blur rounded-lg overflow-hidden flex flex-col hover:bg-black/60 transition-colors"
    >
      <img
        src={post.coverImage || "https://via.placeholder.com/400x250?text=RCB+News"}
        alt={post.title}
        className="h-48 w-full object-cover"
      />
      <div className="p-4 flex flex-col flex-1">
        {post.tags?.length > 0 && (
          <div className="flex gap-2 mb-2">
            {post.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs font-poppins text-rcb-gold border border-rcb-gold/50 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <h3 className="font-poppins font-bold text-white text-lg leading-snug">{post.title}</h3>
        <p className="font-poppins text-white/60 text-sm mt-2 line-clamp-3 flex-1">
          {post.excerpt}
        </p>
        <p className="font-poppins text-white/40 text-xs mt-3">
          {post.author?.name && `${post.author.name} · `}
          {new Date(post.publishedAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
        </p>
      </div>
    </Link>
  );
}
