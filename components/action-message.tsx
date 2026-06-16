import { AlertCircle, CheckCircle2 } from "lucide-react";
import { getActionErrorMessage, getActionSuccessMessage } from "@/lib/action-feedback";

type ActionMessageProps = {
  errorCode?: string;
  successCode?: string;
};

export function ActionMessage({ errorCode, successCode }: ActionMessageProps) {
  const errorMessage = getActionErrorMessage(errorCode);
  const successMessage = getActionSuccessMessage(successCode);
  const message = errorMessage ?? successMessage;

  if (!message) {
    return null;
  }

  const isError = Boolean(errorMessage);

  return (
    <section
      className={[
        "flex gap-3 rounded-lg border px-4 py-3 text-sm leading-6 shadow-soft",
        isError ? "border-red-100 bg-red-50 text-red-800" : "border-leaf/15 bg-mist text-leaf",
      ].join(" ")}
    >
      {isError ? <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" /> : <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />}
      <div>
        <p className="font-bold">{message.title}</p>
        <p className="mt-1 text-slate-700">{message.body}</p>
      </div>
    </section>
  );
}
