import { CalendarCheck } from "lucide-react";
import type { CheckInWithAuthor } from "@/lib/types";
import { moodLabel } from "@/lib/ui/labels";

type TodayStatusProps = {
  checkIn: CheckInWithAuthor | null;
  groupName: string;
};

const rhythmLabels: Array<{ key: keyof Pick<CheckInWithAuthor, "attended" | "bible_read" | "meditated" | "prayed" | "woke_up">; label: string }> = [
  { key: "woke_up", label: "일어남" },
  { key: "bible_read", label: "말씀" },
  { key: "prayed", label: "기도" },
  { key: "meditated", label: "묵상" },
  { key: "attended", label: "예배/모임" },
];

function checkedRhythms(checkIn: CheckInWithAuthor) {
  return rhythmLabels.filter((item) => checkIn[item.key]).map((item) => item.label);
}

export function TodayStatus({ checkIn, groupName }: TodayStatusProps) {
  const todayRhythms = checkIn ? checkedRhythms(checkIn) : [];

  return (
    <section className="rounded-lg bg-leaf p-4 text-white shadow-soft">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/15">
          <CalendarCheck className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-white/80">{groupName}</p>
          <h2 className="mt-1 text-xl font-bold">
            {checkIn ? `오늘은 ${moodLabel(checkIn.mood)}` : "오늘의 체크인을 기다려요"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-white/85">
            {checkIn?.note || "하루에 한 번, 짧게 남겨도 충분해요. 함께 기억할 수 있는 하루의 마음이면 돼요."}
          </p>
          {todayRhythms.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-1">
              <span className="rounded-full bg-white/15 px-2 py-1 text-xs font-semibold text-white/80">
                오늘 남긴 리듬
              </span>
              {todayRhythms.map((label) => (
                <span className="rounded-full bg-white/15 px-2 py-1 text-xs font-semibold text-white" key={label}>
                  {label}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
