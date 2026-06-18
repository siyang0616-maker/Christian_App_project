import { Bell, ClipboardList, KeyRound, Moon, UsersRound } from "lucide-react";
import type { CheckInWithAuthor, GroupMemberWithProfile, PrayerRequestWithAuthor } from "@/lib/types";
import { formatDateLabel, moodLabel } from "@/lib/ui/labels";

type LeaderDashboardProps = {
  activeGroupName: string;
  inviteCode: string;
  members: GroupMemberWithProfile[];
  quietMembers: GroupMemberWithProfile[];
  recentCheckIns: CheckInWithAuthor[];
  prayers: PrayerRequestWithAuthor[];
};

export function LeaderDashboard({
  activeGroupName,
  inviteCode,
  members,
  quietMembers,
  recentCheckIns,
  prayers,
}: LeaderDashboardProps) {
  const memberOnlyCount = members.filter((member) => member.role === "member").length;
  const today = new Date().toISOString().slice(0, 10);
  const todayCheckIns = recentCheckIns.filter((checkIn) => checkIn.checkin_date === today);
  const latestPrayer = prayers[0];

  return (
    <section className="rounded-lg border border-leaf/15 bg-white/90 p-4 shadow-soft">
      <div className="mb-4 flex items-center gap-2">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-mist text-leaf">
          <ClipboardList className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-bold text-ink">리더 돌봄 보드</h2>
          <p className="text-sm text-slate-600">멤버의 안부와 기도제목을 먼저 살펴봐요.</p>
        </div>
      </div>
      <div className="mb-3 rounded-md border border-leaf/10 bg-mist px-3 py-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-leaf">지금 보고 있는 방</p>
            <p className="mt-1 text-sm font-bold text-ink">{activeGroupName}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1 rounded-full bg-white px-2 py-1 text-xs font-semibold text-leaf">
            <KeyRound className="h-3.5 w-3.5" />
            {inviteCode}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-md bg-mist p-3">
          <p className="text-xs font-semibold text-leaf">참여 멤버</p>
          <p className="mt-1 text-2xl font-bold text-ink">{memberOnlyCount}</p>
          <p className="mt-1 text-xs text-slate-600">리더 포함 {members.length}명</p>
        </div>
        <div className="rounded-md bg-[#F7ECE5] p-3">
          <p className="text-xs font-semibold text-clay">기도로 기억할 제목</p>
          <p className="mt-1 text-2xl font-bold text-ink">{prayers.length}</p>
        </div>
      </div>
      <div className="mt-4 rounded-md border border-slate-100 bg-white px-3 py-3">
        <div className="mb-2 flex items-center gap-2 text-sm font-bold text-ink">
          <Bell className="h-4 w-4 text-leaf" />
          새 활동
        </div>
        <div className="grid gap-1 text-sm leading-6 text-slate-600">
          <p>오늘 남겨진 체크인 {todayCheckIns.length}개</p>
          <p>
            최근 기도제목{" "}
            {latestPrayer ? `${latestPrayer.profiles.display_name}님이 ${formatDateLabel(latestPrayer.created_at)}에 남겼어요.` : "아직 없어요."}
          </p>
        </div>
      </div>
      <div className="mt-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-bold text-ink">
          <UsersRound className="h-4 w-4 text-leaf" />
          방에 들어온 사람
        </div>
        <div className="grid gap-2">
          {members.map((member) => (
            <div className="flex items-center justify-between gap-2 rounded-md border border-slate-100 bg-white px-3 py-2" key={member.user_id}>
              <span className="text-sm font-semibold text-ink">{member.profiles.display_name}</span>
              <span className="rounded-full bg-mist px-2 py-1 text-xs font-semibold text-leaf">
                {member.role === "leader" ? "리더" : "멤버"}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-bold text-ink">
          <Moon className="h-4 w-4 text-leaf" />
          안부를 살펴볼 멤버
        </div>
        {quietMembers.length > 0 ? (
          <div className="grid gap-2">
            {quietMembers.map((member) => (
              <div className="rounded-md border border-slate-100 bg-white px-3 py-2 text-sm text-slate-700" key={member.user_id}>
                {member.profiles.display_name}
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-md border border-slate-100 bg-white px-3 py-2 text-sm text-slate-600">
            오늘은 안부를 더 살펴볼 멤버가 없어요.
          </p>
        )}
      </div>
      <div className="mt-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-bold text-ink">
          <ClipboardList className="h-4 w-4 text-leaf" />
          최근 체크인
        </div>
        <div className="grid gap-2">
          {recentCheckIns.length > 0 ? (
            recentCheckIns.slice(0, 4).map((checkIn) => (
              <div className="rounded-md border border-slate-100 bg-white px-3 py-2" key={checkIn.id}>
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="font-semibold text-ink">{checkIn.profiles.display_name}</span>
                  <span className="text-xs text-slate-500">{formatDateLabel(checkIn.checkin_date)}</span>
                </div>
                <p className="mt-1 text-sm text-slate-600">{moodLabel(checkIn.mood)}</p>
              </div>
            ))
          ) : (
            <p className="rounded-md border border-slate-100 bg-white px-3 py-2 text-sm text-slate-600">
              아직 최근 체크인이 없어요.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
