import express from "express";
import { getMatches, getMatchById, triggerSync } from "../controllers/matchController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getMatches);
router.get("/:id", getMatchById);
router.post("/sync", protect, adminOnly, triggerSync);

export default router;
