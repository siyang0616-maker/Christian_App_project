import { Heart } from "lucide-react";
import { prayForRequest } from "@/lib/actions/prayers";
import type { PrayerReaction, PrayerRequestWithAuthor } from "@/lib/types";
import { formatDateLabel, visibilityLabel } from "@/lib/ui/labels";

type PrayerRequestListProps = {
  currentUserId: string;
  prayers: PrayerRequestWithAuthor[];
  reactions: PrayerReaction[];
};

export function PrayerRequestList({ currentUserId, prayers, reactions }: PrayerRequestListProps) {
  const reactionMap = new Map<string, PrayerReaction[]>();

  reactions.forEach((reaction) => {
    const list = reactionMap.get(reaction.prayer_id) ?? [];
    list.push(reaction);
    reactionMap.set(reaction.prayer_id, list);
  });

  return (
    <section className="grid gap-3">
      <div>
        <h2 className="font-bold text-ink">기도제목 카드</h2>
        <p className="text-sm text-slate-600">오늘 함께 기도로 기억할 제목이에요.</p>
      </div>
      {prayers.length > 0 ? (
        prayers.map((prayer) => {
          const prayerReactions = reactionMap.get(prayer.id) ?? [];
          const alreadyPrayed = prayerReactions.some((reaction) => reaction.user_id === currentUserId);
          const authorName = prayer.visibility === "anonymous" ? "익명" : prayer.profiles.display_name;

          return (
            <article className="rounded-lg border border-white/70 bg-white/90 p-4 shadow-soft" key={prayer.id}>
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-ink">{authorName}</p>
                  <p className="text-xs text-slate-500">
                    {visibilityLabel(prayer.visibility)} · {formatDateLabel(prayer.created_at)}
                  </p>
                </div>
                <span className="rounded-full bg-mist px-2 py-1 text-xs font-semibold text-leaf">
                  {prayerReactions.length}명이 기도했어요
                </span>
              </div>
              <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{prayer.content}</p>
              <form action={prayForRequest} className="mt-4">
                <input name="prayerId" type="hidden" value={prayer.id} />
                <button
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-clay/25 bg-[#FFF9F5] px-3 text-sm font-semibold text-clay disabled:opacity-60"
                  disabled={alreadyPrayed}
                  type="submit"
                >
                  <Heart className={alreadyPrayed ? "h-4 w-4 fill-current" : "h-4 w-4"} />
                  {alreadyPrayed ? "기도로 기억 중" : "기도했어요"}
                </button>
              </form>
            </article>
          );
        })
      ) : (
        <p className="rounded-lg border border-white/70 bg-white/80 p-4 text-sm text-slate-600">
          아직 남겨진 기도제목이 없어요.
        </p>
      )}
    </section>
  );
}
