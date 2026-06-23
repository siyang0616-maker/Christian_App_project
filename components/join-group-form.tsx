import { KeyRound } from "lucide-react";
import { joinGroup } from "@/lib/actions/groups";

type JoinGroupFormProps = {
  defaultInviteCode?: string;
  returnTo?: string;
};

export function JoinGroupForm({ defaultInviteCode = "", returnTo = "/" }: JoinGroupFormProps) {
  return (
    <section className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-[0_1px_2px_rgba(31,41,51,0.04)]">
      <div className="mb-4 flex items-center gap-2">
        <div className="shrink-0 text-leaf">
          <KeyRound className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-bold text-ink">멤버라면 초대코드 입력</h2>
          <p className="text-sm text-slate-600">리더에게 받은 초대코드를 입력하면 바로 체크인을 시작할 수 있어요.</p>
        </div>
      </div>
      <form action={joinGroup} className="grid gap-3">
        <input name="returnTo" type="hidden" value={returnTo} />
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          초대코드
          <input
            className="h-12 rounded-lg border border-slate-200 bg-white px-3 text-base uppercase tracking-wide transition focus:border-leaf/50 focus:ring-4 focus:ring-leaf/10"
            defaultValue={defaultInviteCode}
            maxLength={10}
            name="inviteCode"
            placeholder="AB12CD"
            required
          />
        </label>
        <button className="h-12 rounded-lg border border-leaf/25 bg-white px-4 font-semibold text-leaf transition hover:bg-[#F5F8F6]" type="submit">
          초대코드로 참여하기
        </button>
      </form>
    </section>
  );
}
