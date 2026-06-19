import { readFileSync } from "node:fs";

function read(path) {
  return readFileSync(path, "utf8");
}

function assertIncludes(source, expected, label) {
  if (!source.includes(expected)) {
    throw new Error(`${label} is missing: ${expected}`);
  }
}

function assertExcludes(source, forbidden, label) {
  if (source.includes(forbidden)) {
    throw new Error(`${label} must not include: ${forbidden}`);
  }
}

const careData = read("lib/data/leader-care-board.ts");
const careBoard = read("components/leader-care-board.tsx");
const copyButton = read("components/copy-text-button.tsx");
const leaderDashboardData = read("lib/data/leader-dashboard.ts");
const leaderDashboardView = read("components/leader-dashboard-view.tsx");
const verifyScript = read("scripts/verify.mjs");

assertIncludes(careData, "export function buildLeaderInbox", "leader care data");
assertIncludes(careData, "export function groupPrayersByDate", "leader care data");
assertIncludes(careData, "export function buildMemberCareSummaries", "leader care data");
assertIncludes(careData, "export function buildCopyReadyMessages", "leader care data");
assertIncludes(careData, "visibility !== \"anonymous\"", "anonymous privacy guard");
assertIncludes(careData, "authorLabel: \"익명\"", "anonymous author masking");
assertIncludes(careData, "기도 응원 문구", "copy-ready prayer support label");

assertExcludes(careData, "events", "leader care data v1 scope");
assertExcludes(careData, "rsvp", "leader care data v1 scope");
assertExcludes(careData, "attendance", "leader care data v1 scope");
assertExcludes(careData, "service_role", "leader care data security");

assertIncludes(careBoard, "리더 돌봄 보드", "leader care board");
assertIncludes(careBoard, "오늘 살펴볼 안부", "leader care board");
assertIncludes(careBoard, "기도제목 타임라인", "leader care board");
assertIncludes(careBoard, "멤버별 안부 스냅샷", "leader care board");
assertIncludes(careBoard, "CopyTextButton", "leader care board");

assertIncludes(copyButton, "\"use client\"", "copy text button");
assertIncludes(copyButton, "navigator.clipboard", "copy text button");
assertIncludes(copyButton, "document.execCommand", "copy text fallback");

assertIncludes(leaderDashboardData, "createLeaderCareBoardData", "leader dashboard data");
assertIncludes(leaderDashboardData, "prayerReactions", "leader dashboard data");
assertIncludes(leaderDashboardView, "LeaderCareBoard", "leader dashboard view");
assertIncludes(verifyScript, "check-leader-care-board-regression.mjs", "verify script");

console.log("Leader care board regression checks passed.");
