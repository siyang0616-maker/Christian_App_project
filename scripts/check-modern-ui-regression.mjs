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

const appShell = read("components/app-shell.tsx");
const leaderCareBoard = read("components/leader-care-board.tsx");
const checkInForm = read("components/check-in-form.tsx");
const prayerForm = read("components/prayer-request-form.tsx");
const prayerList = read("components/prayer-request-list.tsx");
const todayStatus = read("components/today-status.tsx");
const visibilitySelect = read("components/visibility-select.tsx");
const shareButton = read("components/share-text-actions.tsx");
const copyButton = read("components/copy-text-button.tsx");
const verifyScript = read("scripts/verify.mjs");

assertIncludes(appShell, "isLeaderDashboard", "app shell leader layout switch");
assertIncludes(appShell, "max-w-[1120px]", "app shell desktop leader width");
assertIncludes(appShell, "md:px-6", "app shell responsive spacing");

assertIncludes(leaderCareBoard, "CareCommandCenter", "leader board command center");
assertIncludes(leaderCareBoard, "CareMetricCard", "leader board metric cards");
assertIncludes(leaderCareBoard, "CareSignalBoard", "leader board signal board");
assertIncludes(leaderCareBoard, "PrayerCommandList", "leader board prayer timeline");
assertIncludes(leaderCareBoard, "MemberSnapshotRail", "leader board member snapshot rail");
assertIncludes(leaderCareBoard, "MemberStatusTable", "leader board member status table");
assertIncludes(leaderCareBoard, "MemberStatusRow", "leader board compact member matrix rows");
assertIncludes(leaderCareBoard, "MatrixState", "leader board compact member matrix states");
assertIncludes(leaderCareBoard, "const VISIBLE_MEMBER_SUMMARY_COUNT = 20;", "leader board should scan up to 20 members");
assertIncludes(leaderCareBoard, "xl:grid-cols-[minmax(0,1fr)_390px]", "leader board desktop split layout");
assertIncludes(
  leaderCareBoard,
  "grid-cols-[minmax(120px,1.2fr)_74px_74px_88px_minmax(120px,1fr)]",
  "leader board dense member status grid",
);
assertIncludes(leaderCareBoard, "오늘 먼저 볼 사람과 기도제목", "leader board product headline");
assertIncludes(leaderCareBoard, "오늘의 돌봄 큐", "leader board care queue");
assertIncludes(leaderCareBoard, "오늘 우선순위", "leader board priority section");
assertIncludes(leaderCareBoard, "기도제목 타임라인", "leader board prayer timeline title");
assertIncludes(leaderCareBoard, "멤버 상태판", "leader board member status title");
assertIncludes(leaderCareBoard, "member.rhythmStatus.map", "leader board member rhythm rows");
assertIncludes(leaderCareBoard, "기도제목 돌봄 표시", "leader care accessible control group");
assertIncludes(leaderCareBoard, "리더에게만 보이는 표시", "leader-only privacy copy");
assertIncludes(leaderCareBoard, "멤버에게는 이 분류가 보이지 않고", "leader-only privacy safeguard");
assertIncludes(leaderCareBoard, "ShareTextActions", "leader board native share actions");
assertIncludes(leaderCareBoard, "rounded-lg", "leader board controlled card radius");
assertExcludes(leaderCareBoard, "rounded-[30px]", "leader board should avoid oversized old rounded cards");
assertExcludes(leaderCareBoard, "rounded-[26px]", "leader board should avoid oversized old rounded cards");
assertExcludes(leaderCareBoard, "rounded-[24px]", "leader board should avoid oversized old rounded cards");

assertIncludes(visibilitySelect, "role=\"radiogroup\"", "visibility card selector");
assertIncludes(visibilitySelect, "sr-only", "visibility radio inputs");
assertIncludes(visibilitySelect, "has-[:checked]", "visibility selected card state");
assertExcludes(visibilitySelect, "<select", "visibility selector modern card UI");

assertIncludes(checkInForm, "오늘 시작", "check-in category grouping");
assertIncludes(checkInForm, "말씀과 기도", "check-in category grouping");
assertIncludes(checkInForm, "예배와 모임", "check-in category grouping");
assertIncludes(checkInForm, "리더가 멤버의 현재 리듬을 더 잘 살필 수 있어요", "check-in dashboard reflection copy");
assertIncludes(prayerForm, "rounded-2xl", "modern prayer form surface");
assertIncludes(prayerList, "rounded-2xl", "modern prayer card surface");
assertIncludes(todayStatus, "rounded-2xl", "modern today status surface");

assertIncludes(shareButton, "\"use client\"", "share actions client component");
assertIncludes(shareButton, "navigator.share", "native share support");
assertIncludes(shareButton, "sms:", "sms action support");
assertIncludes(shareButton, "CopyTextButton", "copy fallback still available");
assertIncludes(copyButton, "복사됐어요", "copy button Korean feedback");

assertIncludes(verifyScript, "check-modern-ui-regression.mjs", "verify script");

console.log("Modern UI regression checks passed.");
