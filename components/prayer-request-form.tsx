import { HandHeart } from "lucide-react";
import { createPrayerRequest } from "@/lib/actions/prayers";
import { VisibilitySelect } from "@/components/visibility-select";

type PrayerRequestFormProps = {
  groupId: string;
};

export function PrayerRequestForm({ groupId }: PrayerRequestFormProps) {
  return (
    <section className="rounded-lg border border-white/70 bg-white/90 p-4 shadow-soft">
      <div className="mb-4 flex items-center gap-2">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-[#F7ECE5] text-clay">
          <HandHeart className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-bold text-ink">함께 기억할 기도제목</h2>
          <p className="text-sm text-slate-600">카톡처럼 흘러가지 않게 카드로 남겨요.</p>
        </div>
      </div>
      <form action={createPrayerRequest} className="grid gap-3">
        <input name="groupId" type="hidden" value={groupId} />
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          기도제목
          <textarea
            className="min-h-28 rounded-md border border-slate-200 bg-white px-3 py-3 text-base"
            maxLength={500}
            name="content"
            placeholder="기도로 함께 기억하고 싶은 제목을 남겨요."
            required
          />
        </label>
        <VisibilitySelect includeAnonymous />
        <button className="h-12 rounded-md bg-clay px-4 font-semibold text-white" type="submit">
          기도제목 남기기
        </button>
      </form>
    </section>
  );
}
