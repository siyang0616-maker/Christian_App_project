import { HandHeart } from "lucide-react";
import { createPrayerRequest } from "@/lib/actions/prayers";
import { PrayerRequestDraftFields } from "@/components/prayer-request-draft-fields";
import { SubmitButton } from "@/components/submit-button";

type PrayerRequestFormProps = {
  groupId: string;
  clearDraft?: boolean;
  returnTo?: string;
};

export function PrayerRequestForm({ groupId, clearDraft = false, returnTo = "/#prayer-cards" }: PrayerRequestFormProps) {
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
        <input name="returnTo" type="hidden" value={returnTo} />
        <PrayerRequestDraftFields clearDraft={clearDraft} groupId={groupId} />
        <SubmitButton className="h-12 rounded-md bg-clay px-4 font-semibold text-white" pendingLabel="기도제목을 저장하고 있어요...">
          기도제목 남기기
        </SubmitButton>
      </form>
    </section>
  );
}
