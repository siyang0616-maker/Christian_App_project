import { Plus } from "lucide-react";
import { createGroup } from "@/lib/actions/groups";

export function CreateGroupForm() {
  return (
    <section className="rounded-lg border border-white/70 bg-white/90 p-4 shadow-soft">
      <div className="mb-4 flex items-center gap-2">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-mist text-leaf">
          <Plus className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-bold text-ink">리더라면 방 만들기</h2>
          <p className="text-sm text-slate-600">소그룹 이름을 넣고 초대코드를 만들어요.</p>
        </div>
      </div>
      <form action={createGroup} className="grid gap-3">
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          동행방 이름
          <input
            className="h-12 rounded-md border border-slate-200 bg-white px-3 text-base"
            maxLength={40}
            name="name"
            placeholder="청년부 목요 소그룹"
            required
          />
        </label>
        <button className="h-12 rounded-md bg-leaf px-4 font-semibold text-white" type="submit">
          방 만들기
        </button>
      </form>
    </section>
  );
}
