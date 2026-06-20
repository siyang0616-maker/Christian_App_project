import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

function assertIncludes(source, expected, label) {
  assert.match(source, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), `${label} should include ${expected}.`);
}

function assertOrder(source, first, second, label) {
  const firstIndex = source.indexOf(first);
  const secondIndex = source.indexOf(second);

  assert.notEqual(firstIndex, -1, `${label} should include ${first}.`);
  assert.notEqual(secondIndex, -1, `${label} should include ${second}.`);
  assert.ok(firstIndex < secondIndex, `${label} should render ${first} before ${second}.`);
}

const home = read("app/page.tsx");
const leaderDashboard = read("components/leader-dashboard.tsx");
const prayerList = read("components/prayer-request-list.tsx");
const checkInActivityList = read("components/check-in-activity-list.tsx");
const todayStatus = read("components/today-status.tsx");
const leaderInvite = read("components/leader-invite-card.tsx");

assertOrder(home, "<LeaderDashboard", "<CheckInActivityList", "leader home information order");
assertOrder(home, "<CheckInForm", "<LeaderInviteCard", "leader invite placement");

assertIncludes(leaderDashboard, "오늘 먼저 살필 것", "leader dashboard");
assertIncludes(leaderDashboard, "새 기도제목", "leader dashboard");
assertIncludes(leaderDashboard, "멤버 안부", "leader dashboard");
assertIncludes(leaderDashboard, "감시나 평가가 아니라", "leader dashboard care language");

assertIncludes(prayerList, "공개 범위", "prayer cards");
assertIncludes(prayerList, "기도로 기억 중", "prayer cards");
assertIncludes(prayerList, "리더 보드에도 함께 정리돼요", "prayer cards empty state");

assertIncludes(checkInActivityList, "rhythmLabels", "check-in activity list");
assertIncludes(checkInActivityList, "오늘 리듬", "check-in activity list");
assertIncludes(checkInActivityList, "리더에게 보이는 안부", "check-in activity list");

assertIncludes(todayStatus, "rhythmLabels", "today status");
assertIncludes(todayStatus, "하루에 한 번", "today status");
assertIncludes(todayStatus, "오늘 남긴 리듬", "today status");

assertIncludes(leaderInvite, "필요할 때 초대코드와 카톡용 메시지를 열어 복사해요.", "leader invite collapsed copy");

console.log("Beta quality copy regression checks passed.");
