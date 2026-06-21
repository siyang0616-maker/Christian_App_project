"use client";

import { useEffect, useMemo, useState } from "react";
import type { PrayerVisibility } from "@/lib/types";

type PrayerDraft = {
  content: string;
  visibility: PrayerVisibility;
};

type PrayerRequestDraftFieldsProps = {
  groupId: string;
  clearDraft: boolean;
};

const defaultDraft: PrayerDraft = {
  content: "",
  visibility: "group",
};

const visibilityOptions: Array<{ value: PrayerVisibility; label: string; hint: string }> = [
  { value: "group", label: "소그룹 전체", hint: "모든 멤버가 볼 수 있어요" },
  { value: "leader", label: "리더와 나", hint: "리더와 나만 볼 수 있어요" },
  { value: "private", label: "나만 보기", hint: "개인 기록으로 남겨요" },
  { value: "anonymous", label: "이름 숨김", hint: "방 안에서 이름 없이 보여요" },
];

function getStorageKey(groupId: string) {
  return `donghaeng:prayer-request-draft:${groupId}`;
}

function getStoredDraft(storageKey: string) {
  try {
    return sessionStorage.getItem(storageKey);
  } catch {
    return null;
  }
}

function setStoredDraft(storageKey: string, draft: PrayerDraft) {
  try {
    sessionStorage.setItem(storageKey, JSON.stringify(draft));
  } catch {
    // If browser storage is unavailable, the form still works without draft persistence.
  }
}

function removeStoredDraft(storageKey: string) {
  try {
    sessionStorage.removeItem(storageKey);
  } catch {
    // If browser storage is unavailable, the form still works without draft persistence.
  }
}

function parseDraft(rawDraft: string | null): PrayerDraft {
  if (!rawDraft) {
    return defaultDraft;
  }

  try {
    const parsed = JSON.parse(rawDraft) as Partial<PrayerDraft>;
    const parsedVisibility = parsed.visibility;
    const visibility =
      parsedVisibility && visibilityOptions.some((option) => option.value === parsedVisibility)
        ? parsedVisibility
        : defaultDraft.visibility;

    return {
      content: typeof parsed.content === "string" ? parsed.content : defaultDraft.content,
      visibility,
    };
  } catch {
    return defaultDraft;
  }
}

export function PrayerRequestDraftFields({ groupId, clearDraft }: PrayerRequestDraftFieldsProps) {
  const storageKey = useMemo(() => getStorageKey(groupId), [groupId]);
  const [draft, setDraft] = useState<PrayerDraft>(defaultDraft);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (clearDraft) {
      removeStoredDraft(storageKey);
      setDraft(defaultDraft);
      setIsHydrated(true);
      return;
    }

    setDraft(parseDraft(getStoredDraft(storageKey)));
    setIsHydrated(true);
  }, [clearDraft, storageKey]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const hasDraft = draft.content.trim().length > 0 || draft.visibility !== defaultDraft.visibility;

    if (!hasDraft) {
      removeStoredDraft(storageKey);
      return;
    }

    setStoredDraft(storageKey, draft);
  }, [draft, isHydrated, storageKey]);

  return (
    <>
      <label className="grid gap-1 text-sm font-medium text-slate-700">
        기도제목
        <textarea
          className="min-h-28 rounded-lg border border-slate-200 bg-white px-3 py-3 text-base transition focus:border-leaf/50 focus:ring-4 focus:ring-leaf/10"
          maxLength={500}
          name="content"
          onChange={(event) => setDraft((currentDraft) => ({ ...currentDraft, content: event.target.value }))}
          placeholder="기도로 함께 기억하고 싶은 제목을 남겨요."
          required
          value={draft.content}
        />
      </label>
      <label className="grid gap-1 text-sm font-medium text-slate-700">
        공개 범위
        <select
          className="h-12 rounded-lg border border-slate-200 bg-white px-3 text-base transition focus:border-leaf/50 focus:ring-4 focus:ring-leaf/10"
          name="visibility"
          onChange={(event) =>
            setDraft((currentDraft) => ({
              ...currentDraft,
              visibility: event.target.value as PrayerVisibility,
            }))
          }
          value={draft.visibility}
        >
          {visibilityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label} · {option.hint}
            </option>
          ))}
        </select>
        <span className="text-xs font-normal text-slate-500">제출 전에 공개 범위를 꼭 확인해 주세요.</span>
      </label>
    </>
  );
}
