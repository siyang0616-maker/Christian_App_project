"use client";

import { ClipboardCheck, MessageCircle, Share2 } from "lucide-react";
import { useMemo, useState } from "react";
import { CopyTextButton } from "@/components/copy-text-button";

type ShareTextActionsProps = {
  text: string;
  shareLabel?: string;
  copyLabel?: string;
  className?: string;
};

export function ShareTextActions({
  text,
  shareLabel = "공유하기",
  copyLabel = "문구 복사",
  className = "",
}: ShareTextActionsProps) {
  const [shareStatus, setShareStatus] = useState<"idle" | "shared" | "fallback">("idle");
  const smsHref = useMemo(() => `sms:?body=${encodeURIComponent(text)}`, [text]);

  async function handleShare() {
    if (!navigator.share) {
      setShareStatus("fallback");
      window.setTimeout(() => setShareStatus("idle"), 2200);
      return;
    }

    try {
      await navigator.share({ text });
      setShareStatus("shared");
      window.setTimeout(() => setShareStatus("idle"), 1600);
    } catch {
      setShareStatus("fallback");
      window.setTimeout(() => setShareStatus("idle"), 2200);
    }
  }

  const buttonLabel =
    shareStatus === "shared" ? "공유창을 열었어요" : shareStatus === "fallback" ? "복사해서 보내주세요" : shareLabel;

  return (
    <div className={`grid gap-2 ${className}`}>
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <button
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-leaf px-3 text-sm font-black text-white shadow-sm transition hover:bg-leaf/90"
          onClick={handleShare}
          type="button"
        >
          <Share2 className="h-4 w-4" />
          {buttonLabel}
        </button>
        <a
          aria-label="문자로 열기"
          className="grid h-10 w-10 place-items-center rounded-md border border-leaf/20 bg-white text-leaf shadow-sm transition hover:bg-mist"
          href={smsHref}
          title="문자로 열기"
        >
          <MessageCircle className="h-4 w-4" />
        </a>
      </div>
      <CopyTextButton
        className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-black text-leaf transition hover:bg-mist"
        copiedLabel="복사됐어요"
        text={text}
      >
        <ClipboardCheck className="h-4 w-4" />
        {copyLabel}
      </CopyTextButton>
    </div>
  );
}
