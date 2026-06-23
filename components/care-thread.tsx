import { MessageCircle } from "lucide-react";
import { sendCareMessage } from "@/lib/actions/care-messages";
import type { CareMessageParentType, CareMessageWithSender } from "@/lib/types";

type CareThreadProps = {
  className?: string;
  currentUserId: string;
  groupId: string;
  messages: CareMessageWithSender[];
  parentId: string;
  parentType: CareMessageParentType;
  returnTo: string;
  threadOwnerId: string;
};

export function CareThread({
  className = "",
  currentUserId,
  groupId,
  messages,
  parentId,
  parentType,
  returnTo,
  threadOwnerId,
}: CareThreadProps) {
  return (
    <details className={`rounded-lg border border-slate-200 bg-white px-3 py-3 ${className}`}>
      <summary className="flex cursor-pointer items-center justify-between gap-3 rounded-md text-sm font-black text-leaf focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-leaf/30">
        <span className="inline-flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          리더와 대화
        </span>
        <span className="rounded-md bg-[#F3F8F5] px-2 py-1 text-[11px] font-black text-leaf">
          {messages.length > 0 ? `${messages.length}개` : "열기"}
        </span>
      </summary>

      <div className="mt-3 grid gap-3">
        <div className="grid gap-2">
          {messages.length > 0 ? (
            messages.map((message) => {
              const isMine = message.sender_id === currentUserId;

              return (
                <article
                  className={`rounded-lg border px-3 py-2 ${
                    isMine ? "border-leaf/15 bg-[#F3F8F5]" : "border-slate-200 bg-slate-50"
                  }`}
                  key={message.id}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-xs font-black text-ink">
                      {isMine ? "나" : message.profiles.display_name}
                    </p>
                    <p className="shrink-0 text-[11px] font-semibold text-slate-500">
                      {formatCareMessageTime(message.created_at)}
                    </p>
                  </div>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-700">{message.body}</p>
                </article>
              );
            })
          ) : (
            <p className="rounded-lg bg-[#F3F8F5] px-3 py-2 text-sm leading-6 text-slate-600">
              이 체크인이나 기도제목에 대해 리더와 조용히 이어서 나눌 수 있어요.
            </p>
          )}
        </div>

        <form action={sendCareMessage} className="grid gap-2">
          <input name="groupId" type="hidden" value={groupId} />
          <input name="parentType" type="hidden" value={parentType} />
          <input name="parentId" type="hidden" value={parentId} />
          <input name="threadOwnerId" type="hidden" value={threadOwnerId} />
          <input name="returnTo" type="hidden" value={returnTo} />
          <label className="grid gap-1 text-xs font-black text-slate-600">
            답장
            <textarea
              className="min-h-20 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-6 text-ink outline-none transition placeholder:text-slate-400 focus:border-leaf focus:ring-4 focus:ring-leaf/10"
              maxLength={500}
              name="body"
              placeholder="부담 없이 짧게 남겨도 괜찮아요."
              required
            />
          </label>
          <button className="h-10 rounded-md bg-leaf px-3 text-sm font-black text-white transition hover:bg-leaf/90" type="submit">
            메시지 보내기
          </button>
        </form>
      </div>
    </details>
  );
}

function formatCareMessageTime(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Seoul",
  }).format(new Date(value));
}
