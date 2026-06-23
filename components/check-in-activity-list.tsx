import { ClipboardList } from "lucide-react";
import { CareThread } from "@/components/care-thread";
import { careMessageParentKey } from "@/lib/data/care-messages";
import type { CareMessageWithSender, CheckInWithAuthor, MemberRole } from "@/lib/types";
import { formatDateLabel, moodLabel, visibilityLabel } from "@/lib/ui/labels";

type CheckInActivityListProps = {
  careMessages: CareMessageWithSender[];
  checkIns: CheckInWithAuthor[];
  currentUserId: string;
  currentUserRole: MemberRole;
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

export function CheckInActivityList({ careMessages, checkIns, currentUserId, currentUserRole }: CheckInActivityListProps) {
  const careMessagesByParent = buildCareMessageMap(careMessages);

  return (
    <section className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-[0_1px_2px_rgba(31,41,51,0.04)]">
      <div className="mb-3 flex items-start gap-3">
        <div className="mt-0.5 shrink-0 text-leaf">
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
          checkIns.slice(0, 6).map((checkIn) => {
            const canUseThread = checkIn.user_id === currentUserId || currentUserRole === "leader";
            const threadMessages = careMessagesByParent.get(careMessageParentKey("checkin", checkIn.id)) ?? [];

            return (
            <article className="rounded-lg border border-slate-200/70 bg-white px-3 py-3 shadow-[0_1px_2px_rgba(31,41,51,0.04)]" key={checkIn.id}>
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
                <p className="shrink-0 rounded-md bg-[#F5F8F6] px-2 py-1 text-xs font-semibold text-leaf">
                  {moodLabel(checkIn.mood)}
                </p>
              </div>
              {checkedRhythms(checkIn).length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-1">
                  <span className="rounded-md bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-500">
                    오늘 리듬
                  </span>
                  {checkedRhythms(checkIn).map((label) => (
                    <span className="rounded-md bg-[#F5F8F6] px-2 py-1 text-xs font-semibold text-leaf" key={label}>
                      {label}
                    </span>
                  ))}
                </div>
              ) : null}
              {checkIn.note ? <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">{checkIn.note}</p> : null}
              {canUseThread ? (
                <CareThread
                  className="mt-3"
                  currentUserId={currentUserId}
                  groupId={checkIn.group_id}
                  messages={threadMessages}
                  parentId={checkIn.id}
                  parentType="checkin"
                  returnTo="/#check-in-status"
                  threadOwnerId={checkIn.user_id}
                />
              ) : null}
            </article>
            );
          })
        ) : (
          <p className="rounded-lg bg-[#F5F8F6] px-3 py-3 text-sm leading-6 text-slate-600">
            아직 볼 수 있는 안부가 없어요. 멤버가 리더에게 보이는 안부를 남기면 이곳에 보여요.
          </p>
        )}
      </div>
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
