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
    <fieldset className="grid gap-2">
      <legend className="text-sm font-bold text-ink">공개 범위</legend>
      <div className="grid gap-2" role="radiogroup">
        {visibleOptions.map((option) => (
          <label
            className="flex min-h-14 cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm transition has-[:checked]:border-leaf/40 has-[:checked]:bg-[#F5F8F6] has-[:checked]:shadow-sm"
            key={option.value}
          >
            <span className="min-w-0">
              <span className="block font-bold text-ink">{option.label}</span>
              <span className="mt-0.5 block text-xs leading-5 text-slate-500">{option.hint}</span>
            </span>
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-slate-300 bg-white has-[:checked]:border-leaf has-[:checked]:bg-leaf">
              <input
                className="peer sr-only"
                defaultChecked={normalizedDefault === option.value}
                name="visibility"
                type="radio"
                value={option.value}
              />
              <span className="h-2 w-2 rounded-full bg-white opacity-0 peer-checked:opacity-100" />
            </span>
          </label>
        ))}
      </div>
      <p className="text-xs font-normal leading-5 text-slate-500">제출 전에 공개 범위를 꼭 확인해 주세요.</p>
    </fieldset>
  );
}
