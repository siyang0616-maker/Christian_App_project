import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, ClipboardList, HeartHandshake, HeartPulse, Moon, UsersRound } from "lucide-react";
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
  const memberCheckInSummary =
    todayMemberCheckIns.length > 0
      ? `오늘 ${todayMemberCheckIns.length}명의 멤버가 안부를 남겼어요.`
      : "멤버가 체크인을 남기면 여기서 바로 흐름을 볼 수 있어요.";

  return (
    <section className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-[0_1px_2px_rgba(31,41,51,0.04)]">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0 text-leaf">
          <ClipboardList className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-leaf">리더 돌봄 신호</p>
          <h2 className="mt-1 text-lg font-bold text-ink">오늘 함께 기억할 안부를 살펴봐요</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            감시나 평가가 아니라, 조용해진 안부와 새 기도제목을 차분히 기억하기 위한 자리예요.
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-leaf/10 bg-[#F5F8F6] px-3 py-3">
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

      <div className="mt-3 grid gap-2">
        <CareSignal
          body={careSignalSummary}
          icon={careNeededCheckIns.length > 0 ? <HeartPulse className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          tone={careNeededCheckIns.length > 0 ? "clay" : "leaf"}
          title="오늘 먼저 살필 것"
        />
        <CareSignal
          body={latestPrayerSummary}
          icon={<HeartHandshake className="h-4 w-4" />}
          tone={prayers.length > 0 ? "clay" : "leaf"}
          title="새 기도제목"
        />
        <CareSignal
          body={memberCheckInSummary}
          icon={<UsersRound className="h-4 w-4" />}
          tone={todayMemberCheckIns.length > 0 ? "blue" : "leaf"}
          title="멤버 안부"
        />
      </div>

      <Link
        className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-leaf px-4 text-sm font-bold text-white shadow-sm transition hover:bg-leaf/90"
        href="/leader"
      >
        오늘 살필 내용 자세히 보기
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}

function CareSignal({
  body,
  icon,
  title,
  tone,
}: {
  body: string;
  icon: ReactNode;
  title: string;
  tone: "blue" | "clay" | "leaf";
}) {
  const toneClassName =
    tone === "clay"
      ? "border-clay/15 bg-[#FBF4EF] text-clay"
      : tone === "blue"
      ? "border-slate-200 bg-slate-50 text-slate-700"
      : "border-leaf/10 bg-[#F5F8F6] text-leaf";

  return (
    <div className={`rounded-lg border px-3 py-3 ${toneClassName}`}>
      <div className="flex items-start gap-2">
        <span className="mt-0.5 shrink-0">{icon}</span>
        <div className="min-w-0">
          <p className="text-sm font-bold">{title}</p>
          <p className="mt-1 text-sm leading-6 text-slate-700">{body}</p>
        </div>
      </div>
    </div>
  );
}

function Summary({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-white px-3 py-3 text-center">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-ink">{value}</p>
    </div>
  );
}
