"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { requestPasswordReset, submitAuth } from "@/lib/actions/auth";
import { SubmitButton } from "@/components/submit-button";

type AuthIntent = "signIn" | "signUp";

export type AuthPanelMessage = {
  tone: "error" | "success";
  title: string;
  body: string;
  suggestedIntent?: AuthIntent;
};

type AuthFormProps = {
  message?: AuthPanelMessage;
  returnTo?: string;
};

const intentCopy: Record<AuthIntent, { label: string; helper: string; submit: string; passwordComplete: string }> = {
  signIn: {
    label: "로그인",
    helper: "이미 만든 계정이 있다면 이메일과 비밀번호로 들어갈 수 있어요.",
    submit: "로그인",
    passwordComplete: "current-password",
  },
  signUp: {
    label: "새 계정",
    helper: "처음이라면 가입 확인 메일을 받을 수 있는 이메일로 계정을 만들어요.",
    submit: "새 계정 만들기",
    passwordComplete: "new-password",
  },
};

function validateEmailField(email: string): AuthPanelMessage | undefined {
  if (!email.trim()) {
    return {
      tone: "error",
      title: "이메일을 입력해 주세요",
      body: "가입 확인과 로그인을 위해 사용할 이메일이 필요해요.",
    };
  }

  if (!email.includes("@")) {
    return {
      tone: "error",
      title: "이메일 형식을 확인해 주세요",
      body: "예: name@example.com 형식으로 입력해 주세요.",
    };
  }

  return undefined;
}

function validateAuthFields(email: string, password: string): AuthPanelMessage | undefined {
  const emailMessage = validateEmailField(email);

  if (emailMessage) {
    return emailMessage;
  }

  if (!password) {
    return {
      tone: "error",
      title: "비밀번호를 입력해 주세요",
      body: "동행방에 다시 들어올 때 사용할 비밀번호가 필요해요.",
    };
  }

  if (password.length < 6) {
    return {
      tone: "error",
      title: "비밀번호를 6자 이상 입력해 주세요",
      body: "너무 짧은 비밀번호는 사용할 수 없어요.",
    };
  }

  return undefined;
}

export function AuthForm({ message, returnTo = "/" }: AuthFormProps) {
  const [intent, setIntent] = useState<AuthIntent>(message?.suggestedIntent ?? "signUp");
  const [email, setEmail] = useState("");
  const [clientMessage, setClientMessage] = useState<AuthPanelMessage>();
  const [showServerMessage, setShowServerMessage] = useState(true);
  const visibleMessage = clientMessage ?? (showServerMessage ? message : undefined);
  const isError = visibleMessage?.tone === "error";
  const showPasswordReset = intent === "signIn" && visibleMessage?.tone !== "success";

  function clearMessages() {
    setClientMessage(undefined);
    setShowServerMessage(false);
  }

  function updateIntent(nextIntent: AuthIntent) {
    setIntent(nextIntent);
    clearMessages();
  }

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
    clearMessages();
  }

  function handleFieldInput() {
    clearMessages();
  }

  function handleAuthSubmit(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const validationMessage = validateAuthFields(email, password);

    if (validationMessage) {
      event.preventDefault();
      setClientMessage(validationMessage);
      setShowServerMessage(false);
    }
  }

  function handleResetSubmit(event: FormEvent<HTMLFormElement>) {
    const validationMessage = validateEmailField(email);

    if (validationMessage) {
      event.preventDefault();
      setClientMessage(validationMessage);
      setShowServerMessage(false);
    }
  }

  return (
    <div className="grid gap-3">
      <form action={submitAuth} className="grid gap-3" noValidate onSubmit={handleAuthSubmit}>
        <div className="grid grid-cols-2 gap-1 rounded-lg bg-[#EFEBE3] p-1" aria-label="로그인 또는 새 계정 선택">
          {(["signIn", "signUp"] as const).map((item) => {
            const isActive = intent === item;

            return (
              <button
                className={[
                  "h-11 rounded-md text-sm font-semibold transition",
                  isActive ? "border border-slate-200/70 bg-white text-leaf shadow-sm" : "text-slate-500",
                ].join(" ")}
                key={item}
                onClick={() => updateIntent(item)}
                type="button"
              >
                {intentCopy[item].label}
              </button>
            );
          })}
        </div>

        <p className="text-sm leading-6 text-slate-600">{intentCopy[intent].helper}</p>

        {visibleMessage ? (
          <div
            className={[
              "flex gap-3 rounded-md border px-3 py-3 text-sm leading-6",
              isError ? "border-red-100 bg-red-50 text-red-800" : "border-leaf/15 bg-mist text-leaf",
            ].join(" ")}
          >
            {isError ? <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" /> : <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />}
            <div>
              <p className="font-semibold">{visibleMessage.title}</p>
              <p className="mt-1 text-slate-600">{visibleMessage.body}</p>
            </div>
          </div>
        ) : null}

        <input name="intent" type="hidden" value={intent} />
        <input name="returnTo" type="hidden" value={returnTo} />

        <label className="grid gap-1 text-sm font-medium text-slate-700">
          이메일
          <input
            autoComplete="email"
            className="h-12 rounded-lg border border-slate-200 bg-white px-3 text-base transition focus:border-leaf/50 focus:ring-4 focus:ring-leaf/10"
            inputMode="email"
            name="email"
            onChange={handleEmailChange}
            placeholder="name@example.com"
            type="email"
            value={email}
          />
        </label>
        <label className="grid gap-1 text-sm font-medium text-slate-700">
          비밀번호
          <input
            autoComplete={intentCopy[intent].passwordComplete}
            className="h-12 rounded-lg border border-slate-200 bg-white px-3 text-base transition focus:border-leaf/50 focus:ring-4 focus:ring-leaf/10"
            name="password"
            onInput={handleFieldInput}
            type="password"
          />
        </label>
        <p className="rounded-lg bg-[#F5F1EA] px-3 py-2 text-xs leading-5 text-slate-600">
          공개 범위와 기도제목은 가입 후 동행방 안에서 직접 선택할 수 있어요.
        </p>
        <SubmitButton
          className="h-12 rounded-lg bg-leaf px-4 font-semibold text-white shadow-sm transition hover:bg-leaf/90"
          pendingLabel={intent === "signUp" ? "가입 확인 메일을 보내고 있어요..." : "로그인하고 있어요..."}
        >
          {intentCopy[intent].submit}
        </SubmitButton>
      </form>

      {showPasswordReset ? (
        <form action={requestPasswordReset} className="grid gap-2 rounded-lg border border-leaf/15 bg-mist px-3 py-3" noValidate onSubmit={handleResetSubmit}>
          <input name="email" type="hidden" value={email} />
          <p className="text-xs leading-5 text-slate-600">
            비밀번호가 기억나지 않거나 폰에서 계속 안 들어가지면, 위 이메일로 재설정 메일을 받을 수 있어요.
          </p>
          <button
            className="h-11 rounded-lg border border-leaf/25 bg-white px-3 text-sm font-semibold text-leaf transition hover:bg-[#F5F8F6]"
            type="submit"
          >
            비밀번호 재설정 메일 받기
          </button>
        </form>
      ) : null}
    </div>
  );
}
