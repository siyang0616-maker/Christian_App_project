import { Plus } from "lucide-react";
import { createGroup } from "@/lib/actions/groups";

export function CreateGroupForm() {
  return (
    <section className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-[0_1px_2px_rgba(31,41,51,0.04)]">
      <div className="mb-4 flex items-center gap-2">
        <div className="shrink-0 text-leaf">
          <Plus className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-bold text-ink">리더라면 방 만들기</h2>
          <p className="text-sm text-slate-600">소그룹 이름을 넣으면 멤버에게 보낼 초대코드가 준비돼요.</p>
        </div>
      </div>
      <form action={createGroup} className="grid gap-3">
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          동행방 이름
          <input
            className="h-12 rounded-lg border border-slate-200 bg-white px-3 text-base transition focus:border-leaf/50 focus:ring-4 focus:ring-leaf/10"
            maxLength={40}
            name="name"
            placeholder="청년부 목요 소그룹"
            required
          />
        </label>
        <button className="h-12 rounded-lg bg-leaf px-4 font-semibold text-white shadow-sm transition hover:bg-leaf/90" type="submit">
          리더로 방 만들기
        </button>
      </form>
    </section>
  );
}
