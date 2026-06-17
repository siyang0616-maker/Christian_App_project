"use client";

import { useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { requestPasswordReset, submitAuth } from "@/lib/actions/auth";

type AuthIntent = "signIn" | "signUp";

export type AuthPanelMessage = {
  tone: "error" | "success";
  title: string;
  body: string;
  suggestedIntent?: AuthIntent;
};

type AuthFormProps = {
  message?: AuthPanelMessage;
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

export function AuthForm({ message }: AuthFormProps) {
  const [intent, setIntent] = useState<AuthIntent>(message?.suggestedIntent ?? "signUp");
  const [clientMessage, setClientMessage] = useState<AuthPanelMessage>();
  const [showServerMessage, setShowServerMessage] = useState(true);
  const visibleMessage = clientMessage ?? (showServerMessage ? message : undefined);
  const isError = visibleMessage?.tone === "error";

  function updateIntent(nextIntent: AuthIntent) {
    setIntent(nextIntent);
    setClientMessage(undefined);
    setShowServerMessage(false);
  }

  function handleInput() {
    setClientMessage(undefined);
    setShowServerMessage(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLElement | null;
    const isPasswordReset = submitter?.getAttribute("data-auth-action") === "resetPassword";
    const validationMessage = isPasswordReset ? validateEmailField(email) : validateAuthFields(email, password);

    if (validationMessage) {
      event.preventDefault();
      setClientMessage(validationMessage);
      setShowServerMessage(false);
    }
  }

  return (
    <form action={submitAuth} className="grid gap-3" noValidate onInput={handleInput} onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-1 rounded-md bg-linen p-1" aria-label="로그인 또는 새 계정 선택">
        {(["signIn", "signUp"] as const).map((item) => {
          const isActive = intent === item;

          return (
            <button
              className={[
                "h-11 rounded-md text-sm font-semibold transition",
                isActive ? "bg-white text-leaf shadow-sm" : "text-slate-500",
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

      <label className="grid gap-1 text-sm font-medium text-slate-700">
        이메일
        <input
          autoComplete="email"
          className="h-12 rounded-md border border-slate-200 bg-white px-3 text-base"
          inputMode="email"
          name="email"
          placeholder="name@example.com"
          type="email"
        />
      </label>
      <label className="grid gap-1 text-sm font-medium text-slate-700">
        비밀번호
        <input
          autoComplete={intentCopy[intent].passwordComplete}
          className="h-12 rounded-md border border-slate-200 bg-white px-3 text-base"
          name="password"
          type="password"
        />
      </label>
      <p className="rounded-md bg-linen px-3 py-2 text-xs leading-5 text-slate-600">
        공개 범위와 기도제목은 가입 후 동행방 안에서 직접 선택할 수 있어요.
      </p>
      <button className="h-12 rounded-md bg-leaf px-4 font-semibold text-white" type="submit">
        {intentCopy[intent].submit}
      </button>

      {intent === "signIn" ? (
        <div className="grid gap-2 rounded-md border border-slate-100 bg-white px-3 py-3">
          <p className="text-xs leading-5 text-slate-500">
            다른 브라우저나 카카오톡 안에서는 다시 로그인해야 해요. 비밀번호가 헷갈리면 이메일만 입력하고 재설정 메일을 받아 주세요.
          </p>
          <button
            className="h-11 rounded-md border border-leaf/25 bg-white px-3 text-sm font-semibold text-leaf"
            data-auth-action="resetPassword"
            formAction={requestPasswordReset}
            type="submit"
          >
            비밀번호 재설정 메일 받기
          </button>
        </div>
      ) : null}
    </form>
  );
}
