import { KeyRound } from "lucide-react";
import { joinGroup } from "@/lib/actions/groups";

export function JoinGroupForm() {
  return (
    <section className="rounded-lg border border-white/70 bg-white/90 p-4 shadow-soft">
      <div className="mb-4 flex items-center gap-2">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-bluewash text-leaf">
          <KeyRound className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-bold text-ink">멤버라면 초대코드 입력</h2>
          <p className="text-sm text-slate-600">리더에게 받은 코드로 동행방에 들어가요.</p>
        </div>
      </div>
      <form action={joinGroup} className="grid gap-3">
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          초대코드
          <input
            className="h-12 rounded-md border border-slate-200 bg-white px-3 text-base uppercase tracking-wide"
            maxLength={10}
            name="inviteCode"
            placeholder="AB12CD"
            required
          />
        </label>
        <button className="h-12 rounded-md border border-leaf/25 bg-white px-4 font-semibold text-leaf" type="submit">
          참여하기
        </button>
      </form>
    </section>
  );
}
