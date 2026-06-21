import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const formSource = readFileSync(new URL("../components/prayer-request-form.tsx", import.meta.url), "utf8");
const draftSource = readFileSync(new URL("../components/prayer-request-draft-fields.tsx", import.meta.url), "utf8");
const appPageSource = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const inviteCardSource = readFileSync(new URL("../components/leader-invite-card.tsx", import.meta.url), "utf8");

function assertBefore(source, earlier, later, message) {
  const earlierIndex = source.indexOf(earlier);
  const laterIndex = source.indexOf(later);

  assert.ok(earlierIndex !== -1, `${message}: missing ${earlier}`);
  assert.ok(laterIndex !== -1, `${message}: missing ${later}`);
  assert.ok(earlierIndex < laterIndex, message);
}

function assertIncludes(source, expected, message) {
  assert.ok(source.includes(expected), `${message}: missing ${expected}`);
}

function assertNotIncludes(source, unexpected, message) {
  assert.ok(!source.includes(unexpected), `${message}: found ${unexpected}`);
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

assertIncludes(
  draftSource,
  '{ value: "leader", label: "리더와 나", hint: "리더와 나만 볼 수 있어요" }',
  "Prayer leader visibility option should keep label and hint aligned.",
);

assert.match(
  draftSource,
  /이름 숨김.*방 안에서 이름 없이 보여요/s,
  "Prayer visibility copy should not overpromise technical anonymity.",
);

assertIncludes(
  draftSource,
  '{ value: "anonymous", label: "이름 숨김", hint: "방 안에서 이름 없이 보여요" }',
  "Prayer anonymous visibility option should use name-hidden wording.",
);

assertNotIncludes(
  draftSource,
  "익명으로",
  "Prayer visibility copy should avoid overpromising anonymity.",
);

assertIncludes(
  draftSource,
  "제출 전에 공개 범위를 꼭 확인해 주세요.",
  "Prayer visibility helper should ask users to confirm before submission.",
);

assertBefore(
  appPageSource,
  'id="check-in-status"',
  "<CheckInForm",
  "Home should show today's check-in status before the check-in form.",
);

assertBefore(
  appPageSource,
  "<CheckInForm",
  "<PrayerRequestForm",
  "Home should let members check in before writing a prayer request.",
);

assertBefore(
  appPageSource,
  "<PrayerRequestForm",
  "<PrayerRequestList",
  "Home should keep prayer writing close to the visible prayer cards.",
);

assertBefore(
  appPageSource,
  "<PrayerRequestList",
  "<CheckInActivityList",
  "Home should show prayer cards before check-in activity.",
);

assertBefore(
  appPageSource,
  "<CheckInActivityList",
  "<LeaderInviteCard",
  "Leader invite card should stay below the care and activity sections.",
);

assertBefore(
  appPageSource,
  "<CheckInForm",
  "<LeaderInviteCard",
  "Leader invite card should stay below the check-in form.",
);

assert.match(
  inviteCardSource,
  /const \[isCardOpen, setIsCardOpen\] = useState\(false\);/,
  "Leader invite card should be collapsed by default.",
);

assert.match(
  inviteCardSource,
  /\{isCardOpen \? \(\s*<div className="mt-4 grid gap-3">/s,
  "Leader invite card details should render only after the card is opened.",
);

console.log("Prayer draft regression checks passed.");
