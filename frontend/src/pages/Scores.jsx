import { useEffect, useState, useCallback } from "react";
import { fetchMatches } from "../api/matchesApi.js";
import MatchCard from "../components/MatchCard.jsx";

const tabs = [
  { value: "", label: "All" },
  { value: "live", label: "Live" },
  { value: "upcoming", label: "Upcoming" },
  { value: "completed", label: "Completed" },
];

export default function Scores() {
  const [matches, setMatches] = useState([]);
  const [tab, setTab] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const { data } = await fetchMatches(tab || undefined);
      setMatches(data);
      setError("");
    } catch {
      setError("Couldn't load match data right now.");
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    setLoading(true);
    load();

    // Refresh every 30s so live scores stay current without a manual reload.
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [load]);

  return (
    <div className="container mx-auto pt-28 pb-16">
      <h1 className="font-poppins font-bold text-white text-4xl text-center mb-8">
        Live <span className="text-rcb-gold">Scores</span>
      </h1>

      <div className="flex justify-center gap-3 mb-10">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-4 py-1.5 rounded-full font-poppins text-sm ${
              tab === t.value ? "bg-rcb-gold text-black font-bold" : "text-white border border-white/30"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading && <p className="text-center text-white font-poppins">Loading matches...</p>}
      {error && <p className="text-center text-red-400 font-poppins">{error}</p>}
      {!loading && !error && matches.length === 0 && (
        <p className="text-center text-white/70 font-poppins">
          No RCB matches in this category right now — check back soon.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {matches.map((match) => (
          <MatchCard key={match._id} match={match} />
        ))}
      </div>
    </div>
  );
}
