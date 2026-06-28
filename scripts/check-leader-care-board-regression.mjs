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
const shareButton = read("components/share-text-actions.tsx");
const leaderDashboardData = read("lib/data/leader-dashboard.ts");
const leaderDashboardView = read("components/leader-dashboard-view.tsx");
const profileJoins = read("lib/data/profile-joins.ts");
const schema = read("supabase/schema.sql");
const careMigration = read("supabase/migrations/004_leader_prayer_care_marks.sql");
const validation = read("lib/validation.ts");
const checkInActions = read("lib/actions/check-ins.ts");
const groupActions = read("lib/actions/groups.ts");
const prayerActions = read("lib/actions/prayers.ts");
const verifyScript = read("scripts/verify.mjs");

assertIncludes(careData, "export function buildLeaderInbox", "leader care data");
assertIncludes(careData, "export function groupPrayersByDate", "leader care data");
assertIncludes(careData, "export function buildMemberCareSummaries", "leader care data");
assertIncludes(careData, "export function buildCopyReadyMessages", "leader care data");
assertIncludes(careData, "todayMemberVisibleCheckInCount", "leader care member-only check-in count");
assertIncludes(careData, "priorityRank", "leader care priority sorting");
assertIncludes(careData, "prayerStatusLabel", "leader care prayer status label");
assertIncludes(careData, "copyPreview", "leader care copy preview");
assertIncludes(careData, "export type LeaderRhythmStatusItem", "leader care member rhythm status");
assertIncludes(careData, "rhythmStatus", "leader care member rhythm status");
assertIncludes(careData, "missingRhythmLabels", "leader care member rhythm status");
assertIncludes(careData, "buildRhythmStatus", "leader care member rhythm status");
assertIncludes(careData, "buildMissingRhythmLabels", "leader care member rhythm status");
assertIncludes(careData, "careMark", "leader-only prayer care mark");
assertIncludes(careData, "careScopeLabel", "leader-only prayer care scope label");
assertIncludes(careData, "isImportant", "leader-only important prayer flag");
assertIncludes(careData, "isOngoing", "leader-only ongoing prayer flag");
assertIncludes(careData, "visibility !== \"anonymous\"", "anonymous privacy guard");
assertExcludes(careData, "events", "leader care data v1 scope");
assertExcludes(careData, "rsvp", "leader care data v1 scope");
assertExcludes(careData, "attendance", "leader care data v1 scope");
assertExcludes(careData, "service_role", "leader care data security");

assertIncludes(careBoard, "오늘 먼저 볼 사람과 기도제목", "leader care board headline");
assertIncludes(careBoard, "오늘의 돌봄 큐", "leader care board queue");
assertIncludes(careBoard, "오늘 우선순위", "leader care board priority");
assertIncludes(careBoard, "기도제목 타임라인", "leader care board prayer timeline");
assertIncludes(careBoard, "멤버 상태판", "leader care board member dashboard");
assertIncludes(careBoard, "체크인, 말씀, 기도, 묵상, 예배/모임 상태", "leader care board member rhythm copy");
assertIncludes(careBoard, "MemberStatusRow", "leader care board dense member matrix");
assertIncludes(careBoard, "MatrixState", "leader care board matrix state chips");
assertIncludes(careBoard, "const VISIBLE_MEMBER_SUMMARY_COUNT = 20;", "leader care board should scan up to 20 members");
assertIncludes(careBoard, "grid-cols-[minmax(120px,1.2fr)_74px_74px_88px_minmax(120px,1fr)]", "leader care board desktop member matrix");
assertIncludes(careBoard, "member.rhythmStatus.map", "leader care board member rhythm dashboard");
assertIncludes(careBoard, "RelationshipStatusHeader", "leader care board relationship-first expanded row");
assertIncludes(careBoard, "관계 한 줄", "leader care board relationship status header");
assertIncludes(careBoard, "님과 나눈 대화가 없어요", "leader care board no-thread relationship empty state");
assertIncludes(careBoard, "답장을 기다리고 있어요", "leader care board member-waiting relationship status");
assertIncludes(careBoard, "최근까지 잘 이어지고 있어요", "leader care board connected relationship status");
assertIncludes(careBoard, "border-l-4", "leader care board row priority tone");
assertIncludes(careBoard, "오늘 리듬 상세", "leader care board member rhythm dashboard");
assertIncludes(careBoard, "보낼 문장", "leader care board copy preview");
assertIncludes(careBoard, "리마인드 보내기", "leader care board share action");
assertIncludes(careBoard, "ShareTextActions", "leader care board share action");
assertIncludes(careBoard, "scroll-mt-28", "leader care board sticky header anchor offset");
assertIncludes(careBoard, "VISIBLE_MEMBER_SUMMARY_COUNT", "leader care board scalable member list");
assertIncludes(careBoard, "VISIBLE_PRAYER_DATE_GROUP_COUNT", "leader care board scalable prayer list");
assertIncludes(careBoard, "CopyTextButton", "leader care board copy action");
assertIncludes(careBoard, "기도로 기억하기", "leader care board prayer reaction");
assertIncludes(careBoard, "함께 기도", "leader care scope control");
assertIncludes(careBoard, "개별 돌봄", "leader care scope control");
assertIncludes(careBoard, "중요", "leader important flag control");
assertIncludes(careBoard, "계속 기억", "leader ongoing flag control");
assertIncludes(careBoard, "ActionMessage", "leader prayer feedback placement");
assertIncludes(careBoard, "멤버에게는 이 분류가 보이지 않고", "leader care privacy trust");
assertExcludes(careBoard, "ShareTextButton", "leader care board MVP scope");

assertIncludes(schema, "create table public.leader_prayer_care_marks", "leader prayer care schema");
assertIncludes(schema, "alter table public.leader_prayer_care_marks enable row level security", "leader prayer care RLS");
assertIncludes(schema, "leaders can view prayer care marks", "leader prayer care select policy");
assertIncludes(schema, "leaders can upsert prayer care marks", "leader prayer care insert policy");
assertIncludes(schema, "leaders can update prayer care marks", "leader prayer care update policy");
assertIncludes(schema, "leaders can delete prayer care marks", "leader prayer care delete policy");
assertIncludes(careMigration, "create table public.leader_prayer_care_marks", "leader prayer care migration");
assertIncludes(careMigration, "public.is_group_leader", "leader prayer care migration RLS guard");
assertIncludes(validation, "leaderPrayerCareMarkSchema", "leader prayer care validation");

assertIncludes(copyButton, "\"use client\"", "copy text button");
assertIncludes(copyButton, "navigator.clipboard", "copy text button");
assertIncludes(copyButton, "document.execCommand", "copy text fallback");
assertIncludes(shareButton, "navigator.share", "share text button");
assertIncludes(shareButton, "sms:", "share text SMS fallback");

assertIncludes(leaderDashboardData, "createLeaderCareBoardData", "leader dashboard data");
assertIncludes(leaderDashboardData, "prayerReactions", "leader dashboard data");
assertIncludes(profileJoins, "logOptionalDataQueryWarning", "optional query logging");
assertIncludes(
  leaderDashboardData,
  "logOptionalDataQueryWarning(\"leader-dashboard\", \"leader_prayer_care_marks\", error);",
  "leader prayer care mark fetch should not trigger the Next.js dev error overlay",
);
assertExcludes(
  leaderDashboardData,
  "logDataQueryError(\"leader-dashboard\", \"leader_prayer_care_marks\", error);",
  "leader prayer care mark fetch should degrade gracefully when the optional table is not ready",
);
assertIncludes(leaderDashboardView, "isPrayerFeedback", "leader dashboard prayer feedback routing");
assertIncludes(leaderDashboardView, "LeaderCareBoard", "leader dashboard view");
assertIncludes(checkInActions, "revalidatePath(\"/leader\")", "check-in action leader revalidation");
assertIncludes(groupActions, "revalidatePath(\"/leader\")", "group action leader revalidation");
assertIncludes(prayerActions, "const returnTo = getSafeInternalPath(formData.get(\"returnTo\"), \"/#prayer-cards\")", "prayer reaction return path");
assertIncludes(prayerActions, "revalidatePath(\"/leader\")", "prayer action leader revalidation");
assertIncludes(verifyScript, "check-leader-care-board-regression.mjs", "verify script");

console.log("Leader care board regression checks passed.");
