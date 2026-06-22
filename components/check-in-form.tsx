import { Check, HeartPulse } from "lucide-react";
import { saveCheckIn } from "@/lib/actions/check-ins";
import { SubmitButton } from "@/components/submit-button";
import { VisibilitySelect } from "@/components/visibility-select";
import type { CheckInWithAuthor, Mood } from "@/lib/types";

type CheckInFormProps = {
  groupId: string;
  returnTo?: string;
  todayCheckIn: CheckInWithAuthor | null;
};

const rhythmItems = [
  { name: "woke_up", label: "일어났어요" },
  { name: "bible_read", label: "말씀 읽었어요" },
  { name: "prayed", label: "기도했어요" },
  { name: "meditated", label: "묵상했어요" },
  { name: "attended", label: "예배/모임에 참석했어요" },
] as const;

const rhythmSections = [
  {
    title: "오늘 시작",
    description: "새벽예배나 아침기도 전에, 리더가 굳이 확인 연락을 하지 않아도 되도록 가볍게 남겨요.",
    items: [rhythmItems[0]],
  },
  {
    title: "말씀과 기도",
    description: "말씀, 기도, 묵상을 했는지만 체크해요. 시간이나 분량은 기록하지 않아요.",
    items: [rhythmItems[1], rhythmItems[2], rhythmItems[3]],
  },
  {
    title: "예배와 모임",
    description: "오늘 예배나 모임 참석 여부를 남겨요. 못 갔다면 한 줄 나눔에 사유를 짧게 적어도 괜찮아요.",
    items: [rhythmItems[4]],
  },
] as const;

const moods: Array<{ value: Mood; label: string }> = [
  { value: "good", label: "좋음" },
  { value: "normal", label: "보통" },
  { value: "hard", label: "힘듦" },
  { value: "need_prayer", label: "기도 필요" },
];

function isChecked(todayCheckIn: CheckInWithAuthor | null, name: (typeof rhythmItems)[number]["name"]) {
  return Boolean(todayCheckIn?.[name]);
}

export function CheckInForm({ groupId, returnTo = "/#check-in-status", todayCheckIn }: CheckInFormProps) {
  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white/95 p-4 shadow-[0_12px_30px_rgba(31,41,51,0.06)]">
      <div className="mb-4 flex items-start gap-3">
        <div className="mt-0.5 shrink-0 text-leaf">
          <HeartPulse className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-bold text-ink">오늘 안부 남기기</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            하루에 한 번, 부담 없이 남기는 짧은 체크인이에요. 시간 추적이 아니라 함께 기억하기 위한 안부예요.
          </p>
        </div>
      </div>

      <form action={saveCheckIn} className="grid gap-4">
        <input name="groupId" type="hidden" value={groupId} />
        <input name="returnTo" type="hidden" value={returnTo} />

        <fieldset className="grid gap-3">
          <legend className="mb-1 text-sm font-bold text-ink">오늘 함께 기억할 리듬</legend>
          <p className="text-xs leading-5 text-slate-500">
            각 항목은 오늘 했는지만 가볍게 남겨요. 몇 시에 했는지는 기록하지 않아요. 리더에게 보이도록 선택한
            안부만 대시보드에 반영되어, 리더가 멤버의 현재 리듬을 더 잘 살필 수 있어요.
          </p>
          {rhythmSections.map((section) => (
            <div className="rounded-2xl border border-slate-200/70 bg-[#FAFAF8] p-3" key={section.title}>
              <div className="mb-2">
                <p className="text-sm font-black text-ink">{section.title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">{section.description}</p>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                {section.items.map((item) => (
                  <label
                    className="flex min-h-12 items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition has-[:checked]:border-leaf/40 has-[:checked]:bg-[#F5F8F6] has-[:checked]:text-leaf"
                    key={item.name}
                  >
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-slate-200 bg-white text-transparent has-[:checked]:border-leaf has-[:checked]:bg-leaf has-[:checked]:text-white">
                      <input
                        className="peer sr-only"
                        defaultChecked={isChecked(todayCheckIn, item.name)}
                        name={item.name}
                        type="checkbox"
                      />
                      <Check className="h-4 w-4 peer-checked:text-white" />
                    </span>
                    {item.label}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </fieldset>

        <fieldset className="grid grid-cols-2 gap-2">
          <legend className="col-span-2 mb-1 text-sm font-bold text-ink">오늘 마음</legend>
          {moods.map((mood) => (
            <label
            className="flex min-h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-2 text-center text-sm font-semibold text-slate-700 transition has-[:checked]:border-leaf/40 has-[:checked]:bg-[#F5F8F6] has-[:checked]:text-leaf"
              key={mood.value}
            >
              <input
                className="sr-only"
                defaultChecked={todayCheckIn?.mood === mood.value}
                name="mood"
                required
                type="radio"
                value={mood.value}
              />
              {mood.label}
            </label>
          ))}
        </fieldset>

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          한 줄 나눔
          <textarea
            className="min-h-24 rounded-xl border border-slate-200 bg-white px-3 py-3 text-base transition focus:border-leaf/50 focus:ring-4 focus:ring-leaf/10"
            defaultValue={todayCheckIn?.note ?? ""}
            maxLength={240}
            name="note"
            placeholder="오늘 마음에 남은 감사, 말씀, 안부를 짧게 남겨요."
          />
        </label>

        <VisibilitySelect defaultValue={todayCheckIn?.visibility ?? "group"} />

        <SubmitButton className="h-12 rounded-xl bg-leaf px-4 font-semibold text-white shadow-sm transition hover:bg-leaf/90" pendingLabel="체크인을 저장하고 있어요...">
          {todayCheckIn ? "오늘 안부 수정" : "오늘 안부 저장"}
        </SubmitButton>
      </form>
    </section>
  );
}
