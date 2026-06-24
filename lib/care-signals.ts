const CARE_SIGNAL_KEYWORDS = [
  "힘들",
  "지침",
  "지쳐",
  "포기",
  "그만하고 싶",
  "외롭",
  "혼자",
  "무너",
  "사라지고 싶",
  "버겁",
];

export function hasCareSignal(text: string | null | undefined): boolean {
  if (!text) {
    return false;
  }

  return CARE_SIGNAL_KEYWORDS.some((keyword) => text.includes(keyword));
}
