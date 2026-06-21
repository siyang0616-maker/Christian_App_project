import { Mail } from "lucide-react";
import { AuthForm, type AuthPanelMessage } from "@/components/auth-form";

export type { AuthPanelMessage };

type AuthPanelProps = {
  message?: AuthPanelMessage;
};

export function AuthPanel({ message }: AuthPanelProps) {
  return (
    <section className="rounded-xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_2px_rgba(31,41,51,0.04)]">
      <div className="mb-5 border-b border-slate-100 pb-4">
        <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-mist text-leaf">
          <Mail className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-bold text-ink">소그룹 체크인을 시작해요</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          이메일로 가입하거나 로그인한 뒤, 초대코드로 동행방에 들어갈 수 있어요.
        </p>
      </div>
      <AuthForm message={message} />
    </section>
  );
}
