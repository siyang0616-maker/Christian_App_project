import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const appPageSource = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const todayPageSource = readFileSync(new URL("../app/today/page.tsx", import.meta.url), "utf8");
const checkInFormSource = readFileSync(new URL("../components/check-in-form.tsx", import.meta.url), "utf8");
const prayerListSource = readFileSync(new URL("../components/prayer-request-list.tsx", import.meta.url), "utf8");

assert.match(
  appPageSource,
  /isCheckInFeedback/,
  "Home page should route check-in feedback near the check-in section.",
);

assert.match(
  appPageSource,
  /id="check-in-status"[\s\S]*?<ActionMessage/,
  "Home page should show check-in save feedback near today's status.",
);

assert.match(
  appPageSource,
  /id="prayer-cards"[\s\S]*?<ActionMessage/,
  "Home page should show prayer feedback near the prayer cards anchor.",
);

assert.match(
  todayPageSource,
  /id="check-in-status"[\s\S]*?<ActionMessage/,
  "Today page should show check-in feedback near the check-in section.",
);

assert.match(
  checkInFormSource,
  /returnTo = "\/#check-in-status"/,
  "Check-in form should return users to the visible check-in feedback section.",
);

assert.doesNotMatch(
  prayerListSource,
  /id="prayer-cards"/,
  "Prayer cards anchor should be owned by the page wrapper so feedback can appear inside it.",
);

console.log("Action feedback regression checks passed.");
