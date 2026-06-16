"use client";

import { AlertCircle, Check, ChevronDown, ChevronUp, Copy, KeyRound, Link as LinkIcon, MessageSquareText } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type LeaderInviteCardProps = {
  groupName: string;
  inviteCode: string;
};

type CopiedTarget = "code" | "link" | "message" | null;

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "";
const configuredVercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL?.trim() ?? "";

function normalizeSiteUrl(value: string) {
  if (!value) {
    return "";
  }

  const withProtocol = value.startsWith("http://") || value.startsWith("https://") ? value : `https://${value}`;
  return withProtocol.replace(/\/+$/, "");
}

function isLocalUrl(value: string) {
  try {
    const url = new URL(value);
    return ["localhost", "127.0.0.1", "::1"].includes(url.hostname);
  } catch {
    return true;
  }
}

async function copyToClipboard(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.style.top = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  const copied = document.execCommand("copy");
  document.body.removeChild(textarea);

  if (!copied) {
    throw new Error("Clipboard copy failed");
  }
}

export function LeaderInviteCard({ groupName, inviteCode }: LeaderInviteCardProps) {
  const [currentOrigin, setCurrentOrigin] = useState("");
  const [copiedTarget, setCopiedTarget] = useState<CopiedTarget>(null);
  const [copyNotice, setCopyNotice] = useState("");
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [hasEditedMessage, setHasEditedMessage] = useState(false);
  const betaLink = normalizeSiteUrl(configuredSiteUrl || configuredVercelUrl || currentOrigin);
  const isLocalLink = !betaLink || isLocalUrl(betaLink);
  const inviteLink = !isLocalLink ? `${betaLink}/?inviteCode=${encodeURIComponent(inviteCode)}` : "";
  const defaultInviteMessage = useMemo(
    () =>
      [
        `이번 주부터 ${groupName}에서 동행방을 1주만 가볍게 써보려고 해요.`,
        "",
        "동행방은 카톡을 대체하는 앱이 아니라, 카톡에 흘러가는 기도제목을 함께 기억하는 기록 공간이에요.",
        "대화는 카톡에서 계속하고, 체크인과 기도제목만 동행방에 짧게 남겨보려고 해요.",
        "",
        inviteLink
          ? "아래 링크를 열고 이메일로 가입한 뒤 초대코드를 입력해 주세요."
          : "베타 링크는 운영자가 보내드릴 예정이에요. 링크를 받은 뒤 아래 초대코드를 입력해 주세요.",
        "",
        `링크: ${inviteLink || "[베타 링크]"}`,
        `초대코드: ${inviteCode}`,
        "",
        "부담 없이 오늘 체크인 한 번만 남겨봐 주세요. 기도제목은 공개 범위를 직접 선택할 수 있어요.",
      ].join("\n"),
    [groupName, inviteCode, inviteLink],
  );
  const [inviteMessage, setInviteMessage] = useState(defaultInviteMessage);

  useEffect(() => {
    setCurrentOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    if (!hasEditedMessage) {
      setInviteMessage(defaultInviteMessage);
    }
  }, [defaultInviteMessage, hasEditedMessage]);

  async function copyText(text: string, target: CopiedTarget, label: string) {
    if (!text) {
      setCopyNotice("복사할 내용이 아직 준비되지 않았어요.");
      return;
    }

    try {
      await copyToClipboard(text);
      setCopiedTarget(target);
      setCopyNotice(`${label} 복사했어요.`);
      window.setTimeout(() => setCopiedTarget(null), 2200);
    } catch {
      setCopyNotice("자동 복사가 안 되면 아래 메시지를 길게 눌러 직접 복사해 주세요.");
    }
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
            코드를 먼저 보내고, 필요하면 카톡용 메시지를 다듬어 복사해요.
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        {isLocalLink ? (
          <div className="flex gap-2 rounded-md border border-clay/20 bg-linen px-3 py-3 text-sm leading-6 text-slate-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-clay" />
            <p>
              지금 주소는 내 컴퓨터에서만 열리는 로컬 주소예요. 외부 멤버에게 보내기 전에는 배포된 베타 링크가 필요해요.
            </p>
          </div>
        ) : null}

        <div className="rounded-md bg-mist px-3 py-3">
          <p className="text-xs font-semibold text-leaf">초대코드</p>
          <p className="mt-1 text-2xl font-bold tracking-wide text-ink">{inviteCode}</p>
        </div>

        {inviteLink ? (
          <div className="rounded-md border border-slate-100 bg-white px-3 py-3">
            <p className="text-xs font-semibold text-slate-500">초대링크</p>
            <p className="mt-1 break-all text-sm leading-6 text-slate-700">{inviteLink}</p>
          </div>
        ) : null}

        <div className="grid gap-2 sm:grid-cols-3">
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-leaf/25 bg-white px-3 text-sm font-semibold text-leaf"
            onClick={() => copyText(inviteCode, "code", "초대코드")}
            type="button"
          >
            {copiedTarget === "code" ? <Check className="h-4 w-4" /> : <KeyRound className="h-4 w-4" />}
            코드 복사
          </button>
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-leaf/25 bg-white px-3 text-sm font-semibold text-leaf disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!inviteLink}
            onClick={() => copyText(inviteLink, "link", "초대링크")}
            type="button"
          >
            {copiedTarget === "link" ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
            링크 복사
          </button>
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-leaf px-3 text-sm font-semibold text-white"
            onClick={() => copyText(inviteMessage, "message", "초대 메시지")}
            type="button"
          >
            {copiedTarget === "message" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            메시지 복사
          </button>
        </div>

        <button
          aria-expanded={isMessageOpen}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700"
          onClick={() => setIsMessageOpen((current) => !current)}
          type="button"
        >
          {isMessageOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          {isMessageOpen ? "초대 메시지 접기" : "초대 메시지 보기/편집"}
        </button>

        {isMessageOpen ? (
          <div className="rounded-md border border-slate-100 bg-white px-3 py-3">
            <label className="grid gap-2 text-xs font-semibold text-slate-500">
              멤버에게 보낼 메시지
              <textarea
                className="min-h-56 w-full resize-y rounded-md border border-slate-100 bg-slate-50 p-3 text-sm font-normal leading-6 text-slate-700"
                onChange={(event) => {
                  setHasEditedMessage(true);
                  setInviteMessage(event.target.value);
                }}
                value={inviteMessage}
              />
            </label>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              이 수정은 저장되지 않고, 지금 복사할 메시지에만 반영돼요.
            </p>
          </div>
        ) : null}
        {copyNotice ? <p className="text-sm font-medium text-leaf" aria-live="polite">{copyNotice}</p> : null}
      </div>
    </section>
  );
}
