import { UserRound } from "lucide-react";
import { saveProfile } from "@/lib/actions/profile";

type ProfileSetupFormProps = {
  email: string;
};

export function ProfileSetupForm({ email }: ProfileSetupFormProps) {
  return (
    <section className="rounded-lg border border-white/70 bg-white/90 p-5 shadow-soft">
      <div className="mb-5">
        <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-bluewash text-leaf">
          <UserRound className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-ink">프로필을 준비해요</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          동행방 안에서 사용할 이름만 입력하면 돼요.
        </p>
      </div>
      <form action={saveProfile} className="grid gap-3">
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          이메일
          <input className="h-12 rounded-md border border-slate-200 bg-slate-50 px-3 text-base" readOnly value={email} />
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          이름
          <input
            className="h-12 rounded-md border border-slate-200 bg-white px-3 text-base"
            maxLength={30}
            name="displayName"
            placeholder="홍길동"
            required
          />
        </label>
        <button className="h-12 rounded-md bg-leaf px-4 font-semibold text-white" type="submit">
          저장하고 시작하기
        </button>
      </form>
    </section>
  );
}
