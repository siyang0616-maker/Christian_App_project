"use client";

import { Check, Copy, Link as LinkIcon, MessageSquareText } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type LeaderInviteCardProps = {
  groupName: string;
  inviteCode: string;
};

type CopiedTarget = "link" | "message" | null;

export function LeaderInviteCard({ groupName, inviteCode }: LeaderInviteCardProps) {
  const [betaLink, setBetaLink] = useState("");
  const [copiedTarget, setCopiedTarget] = useState<CopiedTarget>(null);
  const inviteMessage = useMemo(
    () =>
      [
        `이번 주부터 ${groupName}에서 동행방을 1주만 가볍게 써보려고 해요.`,
        "",
        "동행방은 카톡을 대체하는 앱이 아니라, 카톡에 흘러가는 기도제목과 오늘의 안부를 함께 기억하기 위한 작은 기록 공간이에요.",
        "",
        "아래 링크를 열고 이메일로 가입한 뒤 초대코드를 입력해 주세요.",
        "",
        `링크: ${betaLink || "[베타 링크]"}`,
        `초대코드: ${inviteCode}`,
        "",
        "부담 없이 오늘 체크인 한 번만 남겨봐 주세요. 공개 범위는 직접 선택할 수 있어요.",
      ].join("\n"),
    [betaLink, groupName, inviteCode],
  );

  useEffect(() => {
    setBetaLink(window.location.origin);
  }, []);

  async function copyText(text: string, target: CopiedTarget) {
    if (!text || !navigator.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(text);
    setCopiedTarget(target);
    window.setTimeout(() => setCopiedTarget(null), 2200);
  }

  return (
    <section className="rounded-lg border border-leaf/15 bg-white/90 p-4 shadow-soft">
      <div className="mb-3 flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-mist text-leaf">
          <MessageSquareText className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-bold text-ink">멤버 초대하기</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            아래 코드를 멤버에게 보내면 같은 동행방에 들어올 수 있어요.
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        <div className="rounded-md bg-mist px-3 py-3">
          <p className="text-xs font-semibold text-leaf">초대코드</p>
          <p className="mt-1 text-2xl font-bold tracking-wide text-ink">{inviteCode}</p>
        </div>

        <div className="rounded-md border border-slate-100 bg-white px-3 py-3">
          <p className="mb-2 text-xs font-semibold text-slate-500">멤버에게 보낼 메시지</p>
          <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{inviteMessage}</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-leaf/25 bg-white px-3 text-sm font-semibold text-leaf"
            disabled={!betaLink}
            onClick={() => copyText(betaLink, "link")}
            type="button"
          >
            {copiedTarget === "link" ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
            링크 복사
          </button>
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-leaf px-3 text-sm font-semibold text-white"
            onClick={() => copyText(inviteMessage, "message")}
            type="button"
          >
            {copiedTarget === "message" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            메시지 복사
          </button>
        </div>
      </div>
    </section>
  );
}
