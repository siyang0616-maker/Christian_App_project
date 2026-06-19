import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const formSource = readFileSync(new URL("../components/prayer-request-form.tsx", import.meta.url), "utf8");
const draftSource = readFileSync(new URL("../components/prayer-request-draft-fields.tsx", import.meta.url), "utf8");
const appPageSource = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");

assert.match(
  draftSource,
  /"use client"/,
  "Prayer draft fields should be a client component so it can use sessionStorage.",
);

assert.match(
  draftSource,
  /sessionStorage/,
  "Prayer draft fields should preserve unsent prayer text in sessionStorage.",
);

assert.match(
  draftSource,
  /groupId/,
  "Prayer draft storage should be scoped by groupId.",
);

assert.match(
  draftSource,
  /clearDraft/,
  "Prayer draft fields should clear only after a successful prayer save.",
);

assert.match(
  formSource,
  /PrayerRequestDraftFields/,
  "Prayer request form should use the draft-preserving fields.",
);

assert.match(
  appPageSource,
  /clearDraft=\{actionSuccess === "prayer-saved"\}/,
  "Home page should clear prayer drafts only after prayer-saved feedback.",
);

console.log("Prayer draft regression checks passed.");
