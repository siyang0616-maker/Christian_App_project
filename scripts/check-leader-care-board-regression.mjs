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
assertIncludes(careData, "todayMemberVisibleCheckInCount", "leader care v1.1 member-only check-in count");
assertIncludes(careData, "priorityRank", "leader care v1.1 priority sorting");
assertIncludes(careData, "prayerStatusLabel", "leader care v1.5 prayer status label");
assertIncludes(careData, "copyPreview", "leader care v1.1 copy preview");
assertIncludes(careData, "careMark", "leader-only prayer care mark");
assertIncludes(careData, "careScopeLabel", "leader-only prayer care scope label");
assertIncludes(careData, "isImportant", "leader-only important prayer flag");
assertIncludes(careData, "isOngoing", "leader-only ongoing prayer flag");
assertIncludes(careData, "visibility !== \"anonymous\"", "anonymous privacy guard");
assertIncludes(careData, "authorLabel: \"이름 숨김\"", "hidden-name author masking");
assertIncludes(careData, "기도 응원 문구", "copy-ready prayer support label");

assertExcludes(careData, "events", "leader care data v1 scope");
assertExcludes(careData, "rsvp", "leader care data v1 scope");
assertExcludes(careData, "attendance", "leader care data v1 scope");
assertExcludes(careData, "service_role", "leader care data security");

assertIncludes(careBoard, "오늘 먼저 살필 것", "leader care board");
assertIncludes(careBoard, "오늘 연락할 멤버와 함께 기도할 제목", "leader care board");
assertIncludes(careBoard, "먼저 살필 내용", "leader care board");
assertIncludes(careBoard, "함께 기도할 제목", "leader care board");
assertIncludes(careBoard, "멤버에게 보낼 안부 문구", "leader care board");
assertIncludes(careBoard, "공개된 내용만 보여요", "leader care board privacy trust");
assertIncludes(careBoard, "이름 숨김은 그대로 지켜져요", "leader care board privacy trust");
assertIncludes(careBoard, "카톡이나 문자에 붙여넣기 쉽도록 정리한 리더용 문구", "leader care board");
assertIncludes(careBoard, "에게 보낼 문장", "leader care board");
assertIncludes(careBoard, "보낼 문장", "leader care board");
assertIncludes(careBoard, "안부 문구 복사", "leader care board");
assertIncludes(careBoard, "계속 기도할 제목", "leader care board");
assertIncludes(careBoard, "scroll-mt-28", "leader care board sticky header anchor offset");
assertIncludes(careBoard, "focus-visible:outline", "leader care board disclosure focus style");
assertIncludes(careBoard, "VISIBLE_MEMBER_SUMMARY_COUNT", "leader care board scalable member list");
assertIncludes(careBoard, "visibleMemberSummaries", "leader care board scalable member list");
assertIncludes(careBoard, "hiddenMemberSummaries", "leader care board scalable member list");
assertIncludes(careBoard, "나머지 멤버 안부 문구", "leader care board scalable member list");
assertIncludes(careBoard, "VISIBLE_PRAYER_DATE_GROUP_COUNT", "leader care board scalable prayer list");
assertIncludes(careBoard, "visiblePrayerDateGroups", "leader care board scalable prayer list");
assertIncludes(careBoard, "hiddenPrayerDateGroups", "leader care board scalable prayer list");
assertIncludes(careBoard, "이전 기도제목 보기", "leader care board scalable prayer list");
assertIncludes(careBoard, "border-slate-200/70", "leader care board mature surface");
assertIncludes(careBoard, "shadow-[0_1px_2px_rgba(31,41,51,0.04)]", "leader care board quieter surface shadow");
assertIncludes(careBoard, "보낼 문장", "leader care board");
assertIncludes(careBoard, "기도로 기억하기", "leader care board");
assertIncludes(careBoard, "CopyTextButton", "leader care board");
assertExcludes(careBoard, "ShareTextButton", "leader care board MVP scope");
assertExcludes(careBoard, "공유하기", "leader care board MVP scope");
assertIncludes(careBoard, "함께 기도", "leader care scope control");
assertIncludes(careBoard, "개별 돌봄", "leader care scope control");
assertIncludes(careBoard, "중요", "leader important flag control");
assertIncludes(careBoard, "계속 기억", "leader ongoing flag control");
assertIncludes(careBoard, "ActionMessage", "leader prayer feedback placement");
assertIncludes(leaderDashboardView, "isPrayerFeedback", "leader dashboard prayer feedback routing");

assertIncludes(schema, "create table public.leader_prayer_care_marks", "leader prayer care schema");
assertIncludes(schema, "alter table public.leader_prayer_care_marks enable row level security", "leader prayer care RLS");
assertIncludes(schema, "leaders can view prayer care marks", "leader prayer care select policy");
assertIncludes(schema, "leaders can upsert prayer care marks", "leader prayer care insert policy");
assertIncludes(schema, "leaders can update prayer care marks", "leader prayer care update policy");
assertIncludes(schema, "leaders can delete prayer care marks", "leader prayer care delete policy");
assertIncludes(careMigration, "create table public.leader_prayer_care_marks", "leader prayer care migration");
assertIncludes(careMigration, "public.is_group_leader", "leader prayer care migration RLS guard");
assertIncludes(validation, "leaderPrayerCareMarkSchema", "leader prayer care validation");
assertExcludes(careBoard, "리더 확인함", "leader care board copy");

assertIncludes(copyButton, "\"use client\"", "copy text button");
assertIncludes(copyButton, "navigator.clipboard", "copy text button");
assertIncludes(copyButton, "document.execCommand", "copy text fallback");

assertIncludes(leaderDashboardData, "createLeaderCareBoardData", "leader dashboard data");
assertIncludes(leaderDashboardData, "prayerReactions", "leader dashboard data");
assertIncludes(leaderDashboardView, "LeaderCareBoard", "leader dashboard view");
assertIncludes(checkInActions, "revalidatePath(\"/leader\")", "check-in action leader revalidation");
assertIncludes(groupActions, "revalidatePath(\"/leader\")", "group action leader revalidation");
assertIncludes(prayerActions, "const returnTo = getSafeInternalPath(formData.get(\"returnTo\"), \"/#prayer-cards\")", "prayer reaction return path");
assertIncludes(prayerActions, "revalidatePath(\"/leader\")", "prayer action leader revalidation");
assertIncludes(verifyScript, "check-leader-care-board-regression.mjs", "verify script");

console.log("Leader care board regression checks passed.");
