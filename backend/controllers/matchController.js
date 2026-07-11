import Match from "../models/Match.js";
import { syncRcbMatches } from "../services/cricketApiService.js";

// @route GET /api/matches  (public, optional ?state=live|upcoming|completed)
export const getMatches = async (req, res) => {
  try {
    const { state } = req.query;
    const filter = state ? { matchState: state } : {};
    const matches = await Match.find(filter).sort({ dateTimeGMT: 1 });
    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/matches/:id  (public)
export const getMatchById = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ message: "Match not found" });
    res.json(match);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/matches/sync  (admin only — manual refresh, useful for demos)
export const triggerSync = async (req, res) => {
  try {
    const result = await syncRcbMatches();
    res.json({ message: "Sync complete", ...result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
