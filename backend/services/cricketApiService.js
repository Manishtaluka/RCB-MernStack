import axios from "axios";
import Match from "../models/Match.js";

const CRICAPI_BASE = "https://api.cricapi.com/v1";
const RCB_NAME_PATTERNS = ["royal challengers", "rcb"];

const isRcbMatch = (match) => {
  const haystack = `${match.name} ${(match.teams || []).join(" ")}`.toLowerCase();
  return RCB_NAME_PATTERNS.some((p) => haystack.includes(p));
};

const deriveMatchState = (match) => {
  if (match.matchEnded) return "completed";
  if (match.matchStarted && !match.matchEnded) return "live";
  return "upcoming";
};

const normalizeMatch = (match) => ({
  externalId: match.id,
  name: match.name,
  matchType: match.matchType,
  series: match.series_id || match.name?.split(",")[1]?.trim() || "",
  venue: match.venue,
  dateTimeGMT: match.dateTimeGMT ? new Date(match.dateTimeGMT) : undefined,
  status: match.status,
  matchState: deriveMatchState(match),
  teams: match.teams || [],
  score: (match.score || []).map((s) => ({
    inning: s.inning,
    runs: s.r,
    wickets: s.w,
    overs: s.o,
  })),
  lastSyncedAt: new Date(),
});

// Fetches current matches from CricAPI, filters to RCB, and upserts them into Mongo.
// Requires CRICKET_API_KEY in .env — free tier keys available at https://cricapi.com
export const syncRcbMatches = async () => {
  if (!process.env.CRICKET_API_KEY) {
    console.warn("CRICKET_API_KEY not set — skipping live score sync");
    return { synced: 0 };
  }

  try {
    const { data } = await axios.get(`${CRICAPI_BASE}/currentMatches`, {
      params: { apikey: process.env.CRICKET_API_KEY, offset: 0 },
      timeout: 10000,
    });

    if (data.status !== "success" || !Array.isArray(data.data)) {
      console.error("Unexpected CricAPI response shape");
      return { synced: 0 };
    }

    const rcbMatches = data.data.filter(isRcbMatch);

    let synced = 0;
    for (const match of rcbMatches) {
      const normalized = normalizeMatch(match);
      await Match.findOneAndUpdate(
        { externalId: normalized.externalId },
        normalized,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      synced += 1;
    }

    return { synced };
  } catch (err) {
    console.error(`Cricket API sync failed: ${err.message}`);
    return { synced: 0, error: err.message };
  }
};
