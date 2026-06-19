import type { Visibility } from "@/lib/types";

const options: Array<{ value: Visibility; label: string; hint: string }> = [
  { value: "group", label: "소그룹 전체", hint: "모든 멤버가 볼 수 있어요" },
  { value: "leader", label: "리더와 나", hint: "리더와 나만 볼 수 있어요" },
  { value: "private", label: "나만 보기", hint: "개인 기록으로 남겨요" },
  { value: "anonymous", label: "이름 숨김", hint: "방 안에서 이름 없이 보여요" },
];

type VisibilitySelectProps = {
  defaultValue?: Visibility;
  includeAnonymous?: boolean;
};

export function VisibilitySelect({ defaultValue = "group", includeAnonymous = false }: VisibilitySelectProps) {
  const visibleOptions = includeAnonymous ? options : options.filter((option) => option.value !== "anonymous");
  const normalizedDefault = !includeAnonymous && defaultValue === "anonymous" ? "group" : defaultValue;

  return (
    <label className="grid gap-1 text-sm font-medium text-slate-700">
      공개 범위
      <select
        className="h-12 rounded-md border border-slate-200 bg-white px-3 text-base"
        defaultValue={normalizedDefault}
        name="visibility"
      >
        {visibleOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label} · {option.hint}
          </option>
        ))}
      </select>
      <span className="text-xs font-normal text-slate-500">제출 전에 공개 범위를 꼭 확인해 주세요</span>
    </label>
  );
}
