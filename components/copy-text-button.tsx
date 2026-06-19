"use client";

import { useState, type ReactNode } from "react";

type CopyTextButtonProps = {
  text: string;
  children: ReactNode;
  copiedLabel?: string;
  className?: string;
};

export function CopyTextButton({
  text,
  children,
  copiedLabel = "복사됨",
  className = "inline-flex h-10 items-center justify-center rounded-md border border-leaf/20 bg-white px-3 text-sm font-semibold text-leaf shadow-sm transition hover:bg-mist",
}: CopyTextButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  async function handleCopy() {
    try {
      await copyToClipboard(text);
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 1600);
    } catch {
      setStatus("failed");
      window.setTimeout(() => setStatus("idle"), 2200);
    }
  }

  return (
    <button className={className} onClick={handleCopy} type="button">
      {status === "copied" ? copiedLabel : status === "failed" ? "복사 실패" : children}
    </button>
  );
}

async function copyToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.top = "-9999px";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();

  const copied = document.execCommand("copy");
  document.body.removeChild(textarea);

  if (!copied) {
    throw new Error("copy failed");
  }
}
