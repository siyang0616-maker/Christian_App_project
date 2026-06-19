import Link from "next/link";
import { ArrowRight, ClipboardList, Moon, UsersRound } from "lucide-react";
import { koreaDateKey } from "@/lib/dates";
import type { CheckInWithAuthor, GroupMemberWithProfile, PrayerRequestWithAuthor } from "@/lib/types";

type LeaderDashboardProps = {
  activeGroupName: string;
  members: GroupMemberWithProfile[];
  quietMembers: GroupMemberWithProfile[];
  recentCheckIns: CheckInWithAuthor[];
  prayers: PrayerRequestWithAuthor[];
};

export function LeaderDashboard({
  activeGroupName,
  members,
  quietMembers,
  recentCheckIns,
  prayers,
}: LeaderDashboardProps) {
  const memberOnlyCount = members.filter((member) => member.role === "member").length;
  const today = koreaDateKey();
  const todayCheckIns = recentCheckIns.filter((checkIn) => checkIn.checkin_date === today);
  const latestPrayer = prayers[0];
  const latestPrayerSummary = latestPrayer
    ? latestPrayer.visibility === "anonymous"
      ? "익명으로 남겨진 최근 기도제목이 있어요."
      : `${latestPrayer.profiles.display_name}님이 남긴 최근 기도제목이 있어요.`
    : "아직 새로 남겨진 기도제목은 없어요.";

  return (
    <section className="rounded-lg border border-leaf/15 bg-white/90 p-4 shadow-soft">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-mist text-leaf">
          <ClipboardList className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-leaf">리더 요약</p>
          <h2 className="mt-1 text-lg font-bold text-ink">오늘 돌봄 보드를 열어볼까요?</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            자세한 멤버별 안부와 기도제목은 리더 돌봄 보드에서 차분히 확인해요.
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-md border border-leaf/10 bg-mist px-3 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-leaf">지금 보고 있는 방</p>
            <p className="mt-1 truncate text-sm font-bold text-ink">{activeGroupName}</p>
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <Summary label="멤버" value={memberOnlyCount} />
        <Summary label="오늘 안부" value={todayCheckIns.length} />
        <Summary label="기도제목" value={prayers.length} />
      </div>

      <div className="mt-3 rounded-md border border-slate-100 bg-white px-3 py-3 text-sm leading-6 text-slate-600">
        <div className="flex items-start gap-2">
          <Moon className="mt-1 h-4 w-4 shrink-0 text-leaf" />
          <p>
            {quietMembers.length > 0
              ? `${quietMembers.length}명은 가볍게 안부를 물어보면 좋아요.`
              : "오늘은 새로 살펴볼 멤버 신호가 차분해요."}
          </p>
        </div>
        <div className="mt-2 flex items-start gap-2">
          <UsersRound className="mt-1 h-4 w-4 shrink-0 text-leaf" />
          <p>
            {latestPrayerSummary}
          </p>
        </div>
      </div>

      <Link
        className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-leaf px-4 text-sm font-bold text-white"
        href="/leader"
      >
        리더 돌봄 보드 열기
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
