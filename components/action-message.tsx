import { AlertCircle } from "lucide-react";
import { getActionErrorMessage } from "@/lib/action-feedback";

type ActionMessageProps = {
  code?: string;
};

export function ActionMessage({ code }: ActionMessageProps) {
  const message = getActionErrorMessage(code);

  if (!message) {
    return null;
  }

  return (
    <section className="flex gap-3 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800 shadow-soft">
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
      <div>
        <p className="font-bold">{message.title}</p>
        <p className="mt-1 text-slate-700">{message.body}</p>
      </div>
    </section>
  );
}

