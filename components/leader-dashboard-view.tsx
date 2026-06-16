import { BookOpenCheck, HandHeart, HeartPulse, Moon, UsersRound } from "lucide-react";
import type { LeaderDashboardData } from "@/lib/data/leader-dashboard";
import { formatDateLabel, moodLabel } from "@/lib/ui/labels";

type LeaderDashboardViewProps = {
  data: LeaderDashboardData;
};

const metricCards = [
  { key: "totalMembers", label: "전체 멤버", tone: "bg-mist text-leaf" },
  { key: "todayCheckinCount", label: "오늘 체크인한 멤버", tone: "bg-bluewash text-leaf" },
  { key: "bibleReadCount", label: "말씀 읽었어요", tone: "bg-white text-ink" },
  { key: "prayerCount", label: "기도했어요", tone: "bg-white text-ink" },
  { key: "meditationCount", label: "묵상했어요", tone: "bg-white text-ink" },
  { key: "needPrayerMoodCount", label: "기도 필요", tone: "bg-[#F7ECE5] text-clay" },
  { key: "newPrayersThisWeek", label: "이번 주 새 기도제목", tone: "bg-white text-ink" },
  { key: "answeredPrayersThisWeek", label: "이번 주 응답 기록", tone: "bg-white text-ink" },
] as const;

export function LeaderDashboardView({ data }: LeaderDashboardViewProps) {
  return (
    <div className="grid gap-4">
      <section className="rounded-lg bg-leaf p-4 text-white shadow-soft">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/15">
            <HeartPulse className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white/80">리더 돌봄 보드</p>
            <h2 className="mt-1 text-xl font-bold">이번 주 우리 방의 리듬</h2>
            <p className="mt-2 text-sm leading-6 text-white/85">
              흘러가는 대화 대신, 함께 기억할 안부와 기도제목을 차분히 살펴봐요.
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-2">
        {metricCards.map((card) => (
          <div className={`rounded-lg border border-white/70 p-3 shadow-soft ${card.tone}`} key={card.key}>
            <p className="text-xs font-semibold text-slate-600">{card.label}</p>
            <p className="mt-2 text-2xl font-bold">{getMetricValue(data, card.key)}</p>
          </div>
        ))}
      </section>

      <section className="rounded-lg border border-white/70 bg-white/90 p-4 shadow-soft">
        <div className="mb-3 flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-bluewash text-leaf">
            <UsersRound className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-ink">오늘 체크인한 멤버</h3>
            <p className="text-sm text-slate-600">오늘 남겨진 신앙 리듬이에요.</p>
          </div>
        </div>
        <div className="grid gap-2">
          {data.todayCheckins.length > 0 ? (
            data.todayCheckins.map((checkin) => (
              <div className="rounded-md border border-slate-100 bg-white px-3 py-2" key={checkin.id}>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-ink">{checkin.profiles.display_name}</p>
                  <p className="text-xs text-slate-500">{moodLabel(checkin.mood)}</p>
                </div>
                {checkin.note ? <p className="mt-1 text-sm leading-6 text-slate-600">{checkin.note}</p> : null}
              </div>
            ))
          ) : (
            <p className="rounded-md bg-mist px-3 py-2 text-sm text-slate-600">아직 오늘 남겨진 체크인이 없어요.</p>
          )}
        </div>
      </section>

      <section className="rounded-lg border border-white/70 bg-white/90 p-4 shadow-soft">
        <div className="mb-3 flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-mist text-leaf">
            <Moon className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-ink">조용한 멤버</h3>
            <p className="text-sm text-slate-600">최근 3일 동안 안부가 필요할 수 있어요.</p>
          </div>
        </div>
        <div className="grid gap-2">
          {data.quietMembers.length > 0 ? (
            data.quietMembers.map((member) => (
              <div className="rounded-md border border-slate-100 bg-white px-3 py-2 text-sm font-semibold text-slate-700" key={member.user_id}>
                {member.profiles.display_name}
              </div>
            ))
          ) : (
            <p className="rounded-md bg-mist px-3 py-2 text-sm text-slate-600">이번 주에는 모두의 리듬이 잘 남아 있어요.</p>
          )}
        </div>
      </section>

      <section className="rounded-lg border border-white/70 bg-white/90 p-4 shadow-soft">
        <div className="mb-3 flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-[#F7ECE5] text-clay">
            <HandHeart className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-ink">기도로 기억할 제목</h3>
            <p className="text-sm text-slate-600">카톡처럼 흘러가지 않게 다시 볼 수 있어요.</p>
          </div>
        </div>
        <div className="grid gap-2">
          {data.prayersToRemember.length > 0 ? (
            data.prayersToRemember.map((prayer) => (
              <article className="rounded-md border border-slate-100 bg-white px-3 py-3" key={prayer.id}>
                <div className="mb-1 flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-ink">{prayer.visibility === "anonymous" ? "익명" : prayer.profiles.display_name}</p>
                  <p className="text-xs text-slate-500">{formatDateLabel(prayer.created_at)}</p>
                </div>
                <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">{prayer.content}</p>
              </article>
            ))
          ) : (
            <p className="rounded-md bg-mist px-3 py-2 text-sm text-slate-600">함께 기억할 새 기도제목을 기다리고 있어요.</p>
          )}
        </div>
      </section>

      <section className="rounded-lg border border-white/70 bg-white/90 p-4 shadow-soft">
        <div className="mb-3 flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-mist text-leaf">
            <BookOpenCheck className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-ink">리더 메모</h3>
            <p className="text-sm text-slate-600">수치는 평가가 아니라 돌봄을 돕는 작은 신호예요.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function getMetricValue(data: LeaderDashboardData, key: (typeof metricCards)[number]["key"]) {
  if (key === "totalMembers") {
    return data.totalMembers;
  }

  return data.metrics[key];
}
