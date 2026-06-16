import { Pencil } from "lucide-react";
import { saveProfile } from "@/lib/actions/profile";

type ProfileNameEditorProps = {
  currentPath?: string;
  profileName: string;
};

export function ProfileNameEditor({ currentPath = "/", profileName }: ProfileNameEditorProps) {
  return (
    <details className="mt-2 max-w-full rounded-md open:border open:border-leaf/15 open:bg-white/75 open:p-3">
      <summary
        className="inline-flex cursor-pointer list-none items-center gap-1 rounded-md py-1 text-xs font-semibold text-leaf [&::-webkit-details-marker]:hidden"
        title="표시 이름 수정"
      >
        <Pencil className="h-3.5 w-3.5" />
        표시 이름 수정
      </summary>
      <form action={saveProfile} className="mt-3 grid gap-2">
        <input name="returnTo" type="hidden" value={currentPath} />
        <label className="grid gap-1 text-xs font-medium text-slate-700">
          동행방 표시 이름
          <input
            autoComplete="name"
            className="h-10 min-w-0 rounded-md border border-slate-200 bg-white px-3 text-sm text-ink"
            defaultValue={profileName}
            maxLength={30}
            name="displayName"
            required
          />
        </label>
        <p className="text-xs leading-5 text-slate-500">
          비밀번호가 아니라 동행방 안에서 다른 멤버에게 보이는 이름이에요.
        </p>
        <button className="h-10 rounded-md bg-leaf px-3 text-sm font-semibold text-white" type="submit">
          이름 저장
        </button>
      </form>
    </details>
  );
}
