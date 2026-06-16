import type { Mood, Visibility } from "@/lib/types";

export function moodLabel(mood: Mood) {
  const labels: Record<Mood, string> = {
    good: "좋음",
    normal: "보통",
    hard: "힘듦",
    need_prayer: "기도 필요",
  };

  return labels[mood];
}

export function visibilityLabel(visibility: Visibility) {
  const labels: Record<Visibility, string> = {
    private: "나만 보기",
    leader: "리더와 나",
    group: "소그룹 전체",
    anonymous: "익명",
  };

  return labels[visibility];
}

export function formatDateLabel(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}
