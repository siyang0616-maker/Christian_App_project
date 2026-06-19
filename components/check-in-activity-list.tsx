import { ClipboardList } from "lucide-react";
import type { CheckInWithAuthor } from "@/lib/types";
import { formatDateLabel, moodLabel, visibilityLabel } from "@/lib/ui/labels";

type CheckInActivityListProps = {
  checkIns: CheckInWithAuthor[];
  currentUserId: string;
};

export function CheckInActivityList({ checkIns, currentUserId }: CheckInActivityListProps) {
  return (
    <section className="rounded-lg border border-white/70 bg-white/90 p-4 shadow-soft">
      <div className="mb-3 flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-bluewash text-leaf">
          <ClipboardList className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-bold text-ink">볼 수 있는 안부</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            내가 볼 수 있는 안부가 여기 모여요. 공개 범위는 카드마다 표시돼요.
          </p>
        </div>
      </div>

      <div className="grid gap-2">
        {checkIns.length > 0 ? (
          checkIns.slice(0, 6).map((checkIn) => (
            <article className="rounded-md border border-slate-100 bg-white px-3 py-3" key={checkIn.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {checkIn.profiles.display_name}
                    {checkIn.user_id === currentUserId ? <span className="text-slate-500"> · 나</span> : null}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {visibilityLabel(checkIn.visibility)} · {formatDateLabel(checkIn.checkin_date)}
                  </p>
                </div>
                <p className="shrink-0 rounded-full bg-mist px-2 py-1 text-xs font-semibold text-leaf">
                  {moodLabel(checkIn.mood)}
                </p>
              </div>
              {checkIn.note ? <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{checkIn.note}</p> : null}
            </article>
          ))
        ) : (
          <p className="rounded-md bg-mist px-3 py-3 text-sm leading-6 text-slate-600">
            아직 볼 수 있는 안부가 없어요. 공개 범위에 맞는 체크인이 생기면 이곳에 보여요.
          </p>
        )}
      </div>
    </section>
  );
}
