import mongoose from "mongoose";

const inningsScoreSchema = new mongoose.Schema(
  {
    inning: { type: String }, // e.g. "Royal Challengers Bengaluru Inning 1"
    runs: { type: Number, default: 0 },
    wickets: { type: Number, default: 0 },
    overs: { type: Number, default: 0 },
  },
  { _id: false }
);

const matchSchema = new mongoose.Schema(
  {
    externalId: { type: String, required: true, unique: true }, // ID from the cricket API
    name: { type: String, required: true }, // e.g. "Royal Challengers Bengaluru vs Chennai Super Kings"
    matchType: { type: String }, // t20, odi, test
    series: { type: String },
    venue: { type: String },
    dateTimeGMT: { type: Date },
    status: { type: String }, // free-text status from the API, e.g. "RCB won by 6 wickets"
    matchState: {
      type: String,
      enum: ["upcoming", "live", "completed"],
      default: "upcoming",
    },
    teams: { type: [String], default: [] },
    score: { type: [inningsScoreSchema], default: [] },
    lastSyncedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Match", matchSchema);
