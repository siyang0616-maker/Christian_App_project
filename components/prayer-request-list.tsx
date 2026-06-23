import { Heart } from "lucide-react";
import { CareThread } from "@/components/care-thread";
import { prayForRequest } from "@/lib/actions/prayers";
import { careMessageParentKey } from "@/lib/data/care-messages";
import type { CareMessageWithSender, MemberRole, PrayerReaction, PrayerRequestWithAuthor } from "@/lib/types";
import { formatDateLabel, visibilityLabel } from "@/lib/ui/labels";

type PrayerRequestListProps = {
  careMessages: CareMessageWithSender[];
  currentUserId: string;
  currentUserRole: MemberRole;
  prayers: PrayerRequestWithAuthor[];
  reactions: PrayerReaction[];
};

export function PrayerRequestList({ careMessages, currentUserId, currentUserRole, prayers, reactions }: PrayerRequestListProps) {
  const reactionMap = new Map<string, PrayerReaction[]>();
  const careMessagesByParent = buildCareMessageMap(careMessages);

  reactions.forEach((reaction) => {
    const list = reactionMap.get(reaction.prayer_id) ?? [];
    list.push(reaction);
    reactionMap.set(reaction.prayer_id, list);
  });

  return (
    <section className="grid gap-3">
      <div>
        <h2 className="font-bold text-ink">기도제목 카드</h2>
        <p className="text-sm leading-6 text-slate-600">
          오늘 함께 기도로 기억할 제목이에요. 공개 범위는 카드마다 다시 보여요.
        </p>
      </div>
      {prayers.length > 0 ? (
        prayers.map((prayer) => {
          const prayerReactions = reactionMap.get(prayer.id) ?? [];
          const alreadyPrayed = prayerReactions.some((reaction) => reaction.user_id === currentUserId);
          const authorName = prayer.visibility === "anonymous" ? "이름 숨김" : prayer.profiles.display_name;
          const canUseThread = prayer.user_id === currentUserId || currentUserRole === "leader";
          const threadMessages = careMessagesByParent.get(careMessageParentKey("prayer", prayer.id)) ?? [];

          return (
            <article className="rounded-2xl border border-slate-200/70 bg-white/95 p-4 shadow-[0_12px_30px_rgba(31,41,51,0.06)]" key={prayer.id}>
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-ink">{authorName}</p>
                  <p className="text-xs text-slate-500">
                    {visibilityLabel(prayer.visibility)} · {formatDateLabel(prayer.created_at)}
                  </p>
                </div>
                <span className="rounded-md bg-[#F5F8F6] px-2 py-1 text-xs font-semibold text-leaf">
                  {alreadyPrayed ? "기도로 기억 중" : `${prayerReactions.length}명이 기도했어요`}
                </span>
              </div>
              <div className="mb-3 inline-flex rounded-md bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-600">
                공개 범위: {visibilityLabel(prayer.visibility)}
              </div>
              <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{prayer.content}</p>
              <form action={prayForRequest} className="mt-4">
                <input name="prayerId" type="hidden" value={prayer.id} />
                <button
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-clay/25 bg-[#FFF9F5] px-3 text-sm font-semibold text-clay transition hover:bg-[#FFF3EA] disabled:opacity-60"
                  disabled={alreadyPrayed}
                  type="submit"
                >
                  <Heart className={alreadyPrayed ? "h-4 w-4 fill-current" : "h-4 w-4"} />
                  {alreadyPrayed ? "기도로 기억 중" : "기도했어요"}
                </button>
              </form>
              {canUseThread ? (
                <CareThread
                  className="mt-3"
                  currentUserId={currentUserId}
                  groupId={prayer.group_id}
                  messages={threadMessages}
                  parentId={prayer.id}
                  parentType="prayer"
                  returnTo="/#prayer-cards"
                  threadOwnerId={prayer.user_id}
                />
              ) : null}
            </article>
          );
        })
      ) : (
        <p className="rounded-2xl border border-slate-200/70 bg-white/95 p-4 text-sm text-slate-600 shadow-[0_12px_30px_rgba(31,41,51,0.06)]">
          아직 남겨진 기도제목이 없어요. 멤버가 공개 범위에 맞게 기도제목을 남기면 리더 보드에도 함께 정리돼요.
        </p>
      )}
    </section>
  );
}

function buildCareMessageMap(messages: CareMessageWithSender[]) {
  const map = new Map<string, CareMessageWithSender[]>();

  messages.forEach((message) => {
    const key = careMessageParentKey(message.parent_type, message.parent_id);
    const list = map.get(key) ?? [];
    list.push(message);
    map.set(key, list);
  });

  return map;
}
