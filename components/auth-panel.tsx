import { Mail } from "lucide-react";
import { AuthForm, type AuthPanelMessage } from "@/components/auth-form";

export type { AuthPanelMessage };

type AuthPanelProps = {
  message?: AuthPanelMessage;
};

export function AuthPanel({ message }: AuthPanelProps) {
  return (
    <section className="rounded-lg border border-white/70 bg-white/85 p-5 shadow-soft">
      <div className="mb-5">
        <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-mist text-leaf">
          <Mail className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-ink">소그룹 체크인을 시작해요</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          이메일로 가입하거나 로그인한 뒤, 초대코드로 동행방에 들어갈 수 있어요.
        </p>
      </div>
      <AuthForm message={message} />
    </section>
  );
}
