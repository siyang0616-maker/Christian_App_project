import { UserRound } from "lucide-react";
import { saveProfile } from "@/lib/actions/profile";

type ProfileSetupFormProps = {
  email: string;
};

export function ProfileSetupForm({ email }: ProfileSetupFormProps) {
  return (
    <section className="rounded-xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_2px_rgba(31,41,51,0.04)]">
      <div className="mb-5 border-b border-slate-100 pb-4">
        <div className="mb-3 text-leaf">
          <UserRound className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-bold text-ink">프로필을 준비해요</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          동행방 안에서 사용할 표시 이름만 입력하면 돼요. 비밀번호가 아니에요.
        </p>
      </div>
      <form action={saveProfile} className="grid gap-3">
        <input name="returnTo" type="hidden" value="/" />
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          이메일
          <input className="h-12 rounded-lg border border-slate-200 bg-slate-50 px-3 text-base" readOnly value={email} />
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          이름
          <input
            className="h-12 rounded-lg border border-slate-200 bg-white px-3 text-base transition focus:border-leaf/50 focus:ring-4 focus:ring-leaf/10"
            maxLength={30}
            name="displayName"
            placeholder="홍길동"
            required
          />
        </label>
        <button className="h-12 rounded-lg bg-leaf px-4 font-semibold text-white shadow-sm transition hover:bg-leaf/90" type="submit">
          저장하고 시작하기
        </button>
      </form>
    </section>
  );
}
