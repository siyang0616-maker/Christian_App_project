import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const dashboardSource = readFileSync(new URL("../lib/data/dashboard.ts", import.meta.url), "utf8");
const leaderDashboardSource = readFileSync(new URL("../lib/data/leader-dashboard.ts", import.meta.url), "utf8");
const joinsSource = readFileSync(new URL("../lib/data/profile-joins.ts", import.meta.url), "utf8");

assert.doesNotMatch(
  dashboardSource,
  /profiles\(\*\)/,
  "Main dashboard data should not rely on embedded profiles(*) joins.",
);

assert.doesNotMatch(
  leaderDashboardSource,
  /profiles\(\*\)/,
  "Leader dashboard data should not rely on embedded profiles(*) joins.",
);

assert.match(
  joinsSource,
  /attachProfilesToMembers/,
  "Dashboard data should attach member profiles after fetching rows.",
);

assert.match(
  joinsSource,
  /attachProfilesToCheckIns/,
  "Dashboard data should attach check-in profiles after fetching rows.",
);

assert.match(
  joinsSource,
  /attachProfilesToPrayers/,
  "Dashboard data should attach prayer profiles after fetching rows.",
);

assert.match(
  joinsSource,
  /fallbackProfile/,
  "Dashboard data should keep rows visible even if profile lookup is incomplete.",
);

console.log("Dashboard data regression checks passed.");
