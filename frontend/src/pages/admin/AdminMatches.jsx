import { useEffect, useState } from "react";
import { fetchMatches, triggerMatchSync } from "../../api/matchesApi.js";

export default function AdminMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState("");

  const load = () => {
    setLoading(true);
    fetchMatches()
      .then(({ data }) => setMatches(data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSync = async () => {
    setSyncing(true);
    setMessage("");
    try {
      const { data } = await triggerMatchSync();
      setMessage(
        data.synced > 0
          ? `Synced ${data.synced} match(es).`
          : "No RCB matches found right now — check your CRICKET_API_KEY, or try again during a live match window."
      );
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || "Sync failed.");
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-poppins font-bold text-white text-2xl">Matches ({matches.length})</h1>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="bg-rcb-gold text-black font-poppins font-bold italic px-4 py-2 rounded disabled:opacity-60"
        >
          {syncing ? "Syncing..." : "Sync now"}
        </button>
      </div>

      {message && <p className="text-rcb-gold font-poppins text-sm mb-4">{message}</p>}

      {loading ? (
        <p className="text-white font-poppins">Loading...</p>
      ) : matches.length === 0 ? (
        <p className="text-white/60 font-poppins">
          No matches cached yet. Hit "Sync now" to pull the latest from the cricket API.
        </p>
      ) : (
        <div className="space-y-2">
          {matches.map((m) => (
            <div key={m._id} className="bg-white/5 rounded px-4 py-2">
              <p className="font-poppins font-bold text-white">
                {m.name} <span className="text-xs text-white/50 font-normal">({m.matchState})</span>
              </p>
              <p className="font-poppins text-white/50 text-xs">{m.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
