import { CalendarDays } from "lucide-react";
import type { TimelineDay } from "@/lib/types";
import { moodLabel } from "@/lib/ui/labels";

type MemberTimelineGridProps = {
  compact?: boolean;
  timeline: TimelineDay[];
  title?: string;
};

const dayFormatter = new Intl.DateTimeFormat("ko-KR", {
  month: "numeric",
  day: "numeric",
  timeZone: "Asia/Seoul",
});

const weekdayFormatter = new Intl.DateTimeFormat("ko-KR", {
  weekday: "short",
  timeZone: "Asia/Seoul",
});

export function MemberTimelineGrid({ compact = false, timeline, title = "최근 4주 안부 기록" }: MemberTimelineGridProps) {
  const checkedDays = timeline.filter((day) => day.hasCheckIn).length;

  return (
    <section className={compact ? "rounded-lg border border-slate-200 bg-white p-3" : "rounded-2xl border border-leaf/15 bg-white/95 p-4 shadow-[0_12px_30px_rgba(31,41,51,0.06)]"}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#F3F8F5] text-leaf">
            <CalendarDays className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h3 className={compact ? "text-sm font-black text-ink" : "text-base font-black text-ink"}>{title}</h3>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              최근 28일 중 {checkedDays}일 기록됐어요.
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-md bg-[#F3F8F5] px-2 py-1 text-xs font-black text-leaf">
          28일
        </span>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1.5">
        {timeline.map((day) => (
          <TimelineCell day={day} key={day.date} />
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-bold text-slate-500">
        <LegendDot className="bg-leaf" label="안부 있음" />
        <LegendDot className="bg-clay" label="힘듦/기도 필요" />
        <LegendDot className="border border-slate-200 bg-white" label="기록 없음" />
      </div>
    </section>
  );
}

function TimelineCell({ day }: { day: TimelineDay }) {
  const toneClass = getDayToneClass(day);
  const label = buildDayLabel(day);

  return (
    <div
      aria-label={label}
      className={`flex aspect-square min-h-9 items-center justify-center rounded-md text-[11px] font-black transition ${toneClass}`}
      data-timeline-date={day.date}
      data-timeline-state={day.hasCheckIn ? day.mood ?? "checked" : "empty"}
      title={label}
    >
      {dayFormatter.format(new Date(`${day.date}T00:00:00+09:00`))}
    </div>
  );
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-2.5 w-2.5 rounded-full ${className}`} />
      {label}
    </span>
  );
}

function getDayToneClass(day: TimelineDay) {
  if (!day.hasCheckIn) {
    return "border border-slate-200 bg-white text-slate-300";
  }

  if (day.mood === "hard" || day.mood === "need_prayer") {
    return "border border-clay/20 bg-[#FFF4EC] text-clay";
  }

  return "border border-leaf/20 bg-[#F3F8F5] text-leaf";
}

function buildDayLabel(day: TimelineDay) {
  const dateLabel = `${dayFormatter.format(new Date(`${day.date}T00:00:00+09:00`))} ${weekdayFormatter.format(
    new Date(`${day.date}T00:00:00+09:00`),
  )}`;

  if (!day.hasCheckIn) {
    return `${dateLabel}: 기록 없음`;
  }

  const rhythms = [
    day.bibleRead ? "말씀" : null,
    day.prayed ? "기도" : null,
    day.attended ? "예배/모임" : null,
  ].filter(Boolean);

  return `${dateLabel}: ${day.mood ? moodLabel(day.mood) : "안부 있음"}${rhythms.length > 0 ? `, ${rhythms.join(", ")}` : ""}`;
}
