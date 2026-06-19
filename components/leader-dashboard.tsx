import Link from "next/link";
import { ArrowRight, ClipboardList, HeartPulse, Moon, UsersRound } from "lucide-react";
import { koreaDateKey } from "@/lib/dates";
import type { CheckInWithAuthor, GroupMemberWithProfile, PrayerRequestWithAuthor } from "@/lib/types";

type LeaderDashboardProps = {
  activeGroupName: string;
  currentUserId: string;
  quietMembers: GroupMemberWithProfile[];
  recentCheckIns: CheckInWithAuthor[];
  prayers: PrayerRequestWithAuthor[];
};

export function LeaderDashboard({
  activeGroupName,
  currentUserId,
  quietMembers,
  recentCheckIns,
  prayers,
}: LeaderDashboardProps) {
  const today = koreaDateKey();
  const todayMemberCheckIns = recentCheckIns.filter(
    (checkIn) => checkIn.checkin_date === today && checkIn.user_id !== currentUserId,
  );
  const careNeededCheckIns = todayMemberCheckIns.filter(
    (checkIn) => checkIn.mood === "hard" || checkIn.mood === "need_prayer",
  );
  const latestPrayer = prayers[0];
  const latestPrayerSummary = latestPrayer
    ? latestPrayer.visibility === "anonymous"
      ? "이름을 숨긴 최근 기도제목을 함께 기억해요."
      : `${latestPrayer.profiles.display_name}님의 최근 기도제목을 함께 기억해요.`
    : "아직 새 기도제목은 없어요. 멤버가 남기면 여기서 함께 기억해요.";
  const careSignalSummary =
    careNeededCheckIns.length > 0
      ? `${careNeededCheckIns.map((checkIn) => checkIn.profiles.display_name).join(", ")}님의 안부를 먼저 살펴보면 좋아요.`
      : quietMembers.length > 0
      ? `${quietMembers.length}명에게 가볍게 안부를 물어보면 좋아요.`
      : "오늘은 따로 안부를 물어볼 멤버가 아직 없어요.";

  return (
    <section className="rounded-lg border border-leaf/15 bg-white/90 p-4 shadow-soft">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-mist text-leaf">
          <ClipboardList className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-leaf">리더 돌봄 신호</p>
          <h2 className="mt-1 text-lg font-bold text-ink">오늘 함께 기억할 안부를 살펴봐요</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            조용해진 안부와 새 기도제목을 먼저 보고, 필요한 멤버를 차분히 돌아봐요.
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-md border border-leaf/10 bg-mist px-3 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-leaf">함께 기억하는 방</p>
            <p className="mt-1 truncate text-sm font-bold text-ink">{activeGroupName}</p>
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <Summary label="살필 안부" value={quietMembers.length} />
        <Summary label="오늘 멤버 안부" value={todayMemberCheckIns.length} />
        <Summary label="기도제목" value={prayers.length} />
      </div>

      <div className="mt-3 rounded-md border border-slate-100 bg-white px-3 py-3 text-sm leading-6 text-slate-600">
        <div className="flex items-start gap-2">
          {careNeededCheckIns.length > 0 ? (
            <HeartPulse className="mt-1 h-4 w-4 shrink-0 text-clay" />
          ) : (
            <Moon className="mt-1 h-4 w-4 shrink-0 text-leaf" />
          )}
          <p>{careSignalSummary}</p>
        </div>
        <div className="mt-2 flex items-start gap-2">
          <UsersRound className="mt-1 h-4 w-4 shrink-0 text-leaf" />
          <p>{latestPrayerSummary}</p>
        </div>
      </div>

      <Link
        className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-leaf px-4 text-sm font-bold text-white"
        href="/leader"
      >
        리더 돌봄 보드에서 자세히 보기
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}

function Summary({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-white px-3 py-3 text-center shadow-sm">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-ink">{value}</p>
    </div>
  );
}
