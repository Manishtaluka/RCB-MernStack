const stateBadge = {
  live: { label: "LIVE", className: "bg-red-500 text-white animate-pulse" },
  upcoming: { label: "UPCOMING", className: "bg-white/20 text-white" },
  completed: { label: "COMPLETED", className: "bg-rcb-gold text-black" },
};

export default function MatchCard({ match }) {
  const badge = stateBadge[match.matchState] || stateBadge.upcoming;

  return (
    <div className="bg-black/50 backdrop-blur rounded-lg p-5">
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-poppins font-bold px-2 py-0.5 rounded ${badge.className}`}>
          {badge.label}
        </span>
        {match.matchType && (
          <span className="text-xs font-poppins text-white/50 uppercase">{match.matchType}</span>
        )}
      </div>

      <h3 className="font-poppins font-bold text-white text-lg mb-1">{match.name}</h3>

      {match.series && <p className="font-poppins text-white/50 text-xs mb-3">{match.series}</p>}

      {match.score?.length > 0 && (
        <div className="space-y-1 mb-3">
          {match.score.map((s, i) => (
            <div key={i} className="flex justify-between font-poppins text-sm">
              <span className="text-white/80">{s.inning}</span>
              <span className="text-rcb-gold font-bold">
                {s.runs}/{s.wickets} ({s.overs} ov)
              </span>
            </div>
          ))}
        </div>
      )}

      <p className="font-poppins text-white/70 text-sm">{match.status}</p>

      {match.venue && (
        <p className="font-poppins text-white/40 text-xs mt-2">
          {match.venue}
          {match.dateTimeGMT &&
            ` · ${new Date(match.dateTimeGMT).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            })}`}
        </p>
      )}
    </div>
  );
}
