import cron from "node-cron";
import { syncRcbMatches } from "../services/cricketApiService.js";

// Runs every 10 minutes. Cricket score APIs are typically rate-limited on
// free tiers, so we don't poll more aggressively than that.
export const startMatchSyncJob = () => {
  // Run once on startup so data isn't empty until the first cron tick
  syncRcbMatches().then(({ synced }) => {
    if (synced) console.log(`Initial match sync: ${synced} RCB match(es) cached`);
  });

  cron.schedule("*/10 * * * *", async () => {
    const { synced } = await syncRcbMatches();
    console.log(`Scheduled match sync: ${synced} RCB match(es) updated`);
  });
};
