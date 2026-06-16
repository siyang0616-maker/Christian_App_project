import { CalendarCheck, Copy } from "lucide-react";
import type { CheckInWithAuthor } from "@/lib/types";
import { moodLabel } from "@/lib/ui/labels";

type TodayStatusProps = {
  checkIn: CheckInWithAuthor | null;
  groupName: string;
  inviteCode: string;
};

export function TodayStatus({ checkIn, groupName, inviteCode }: TodayStatusProps) {
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
            {checkIn?.note || "짧게 남겨도 충분해요. 함께 기억할 수 있는 하루의 마음이면 돼요."}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-md bg-white/12 px-3 py-2 text-sm font-semibold">
            <Copy className="h-4 w-4" />
            초대코드 {inviteCode}
          </div>
        </div>
      </div>
    </section>
  );
}
