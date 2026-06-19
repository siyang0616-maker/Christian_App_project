import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const formSource = readFileSync(new URL("../components/prayer-request-form.tsx", import.meta.url), "utf8");
const draftSource = readFileSync(new URL("../components/prayer-request-draft-fields.tsx", import.meta.url), "utf8");
const appPageSource = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const inviteCardSource = readFileSync(new URL("../components/leader-invite-card.tsx", import.meta.url), "utf8");

function assertBefore(source, earlier, later, message) {
  assert.ok(source.indexOf(earlier) !== -1, `${message}: missing ${earlier}`);
  assert.ok(source.indexOf(later) !== -1, `${message}: missing ${later}`);
  assert.ok(source.indexOf(earlier) < source.indexOf(later), message);
}

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

assert.match(
  draftSource,
  /리더와 나.*리더와 나만 볼 수 있어요/s,
  "Prayer visibility copy should consistently describe leader-only sharing as leader-and-me.",
);

assert.match(
  draftSource,
  /이름 숨김.*방 안에서 이름 없이 보여요/s,
  "Prayer visibility copy should not overpromise technical anonymity.",
);

assertBefore(
  appPageSource,
  "<PrayerRequestList",
  "<PrayerRequestForm",
  "Home should show existing prayer cards before the prayer form.",
);

assertBefore(
  appPageSource,
  "<PrayerRequestForm",
  "<CheckInActivityList",
  "Home should prioritize prayer entry before check-in activity.",
);

assertBefore(
  appPageSource,
  "<CheckInForm",
  "<LeaderInviteCard",
  "Leader invite card should stay below the check-in form.",
);

assert.match(
  inviteCardSource,
  /useState\(false\)/,
  "Leader invite card should be collapsed by default.",
);

console.log("Prayer draft regression checks passed.");
