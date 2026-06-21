"use client";

import { type FormEvent, useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, KeyRound } from "lucide-react";
import { getRecoverySessionFromHash, getRecoveryTokenHashFromSearch } from "@/lib/auth/password-recovery";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

type ResetState = "checking" | "confirm" | "confirming" | "ready" | "missing" | "saving" | "done";

export function PasswordResetForm() {
  const [state, setState] = useState<ResetState>("checking");
  const [message, setMessage] = useState<string>();
  const [tokenHash, setTokenHash] = useState<string>();

  useEffect(() => {
    const tokens = getRecoverySessionFromHash(window.location.hash);
    const tokenHashLink = getRecoveryTokenHashFromSearch(window.location.search);
    const code = new URLSearchParams(window.location.search).get("code");
    const supabase = createBrowserSupabaseClient();

    if (!tokens) {
      if (tokenHashLink) {
        setTokenHash(tokenHashLink.token_hash);
        setState("confirm");
        return;
      }

      if (code) {
        supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
          if (error) {
            setMessage("이 재설정 링크는 사용할 수 없어요. 메일을 요청한 브라우저와 다른 곳에서 열었거나, 링크가 만료되었을 수 있어요.");
            setState("missing");
            return;
          }

          window.history.replaceState(null, "", "/auth/reset-password");
          setState("ready");
        });
        return;
      }

      setState("missing");
      return;
    }

    supabase.auth.setSession(tokens).then(({ error }) => {
      if (error) {
        setMessage("비밀번호 재설정 링크가 만료되었거나 사용할 수 없어요. 다시 요청해 주세요.");
        setState("missing");
        return;
      }

      window.history.replaceState(null, "", "/auth/reset-password");
      setState("ready");
    });
  }, []);

  async function handleConfirmRecovery() {
    if (!tokenHash) {
      setState("missing");
      return;
    }

    setState("confirming");
    setMessage(undefined);

    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: "recovery" });

    if (error) {
      setMessage("비밀번호 재설정 링크가 만료되었거나 이미 사용되었어요. 새 재설정 메일을 요청해 주세요.");
      setState("missing");
      return;
    }

    window.history.replaceState(null, "", "/auth/reset-password");
    setState("ready");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const passwordConfirm = String(formData.get("passwordConfirm") ?? "");

    if (password.length < 6) {
      setMessage("비밀번호는 6자 이상으로 입력해 주세요.");
      return;
    }

    if (password !== passwordConfirm) {
      setMessage("두 비밀번호가 서로 달라요. 다시 확인해 주세요.");
      return;
    }

    setState("saving");
    setMessage(undefined);

    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage("비밀번호를 저장하지 못했어요. 링크를 다시 열거나 새 재설정 메일을 요청해 주세요.");
      setState("ready");
      return;
    }

    await supabase.auth.signOut();
    setState("done");
    window.location.assign("/?notice=password-updated");
  }

  return (
    <section className="rounded-xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_2px_rgba(31,41,51,0.04)]">
      <KeyRound className="h-6 w-6 text-leaf" />
      <h2 className="mt-5 text-lg font-bold text-ink">비밀번호를 새로 설정해요</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        재설정 메일을 통해 들어왔다면 새 비밀번호를 입력해 주세요.
      </p>

      {state === "checking" ? (
        <p className="mt-5 rounded-lg bg-[#F5F1EA] px-3 py-3 text-sm text-slate-600">재설정 링크를 확인하고 있어요.</p>
      ) : null}

      {state === "confirm" || state === "confirming" ? (
        <div className="mt-5 grid gap-3 rounded-lg border border-leaf/15 bg-[#F5F8F6] px-3 py-3 text-sm leading-6 text-slate-700">
          <div className="flex gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-leaf" />
            <div>
              <p className="font-semibold text-leaf">재설정 링크를 찾았어요</p>
              <p className="mt-1 text-slate-600">
                아래 버튼을 누르면 새 비밀번호를 입력할 수 있어요. 링크는 한 번만 사용할 수 있어요.
              </p>
            </div>
          </div>
          <button
            className="h-11 rounded-lg bg-leaf px-4 font-semibold text-white shadow-sm transition hover:bg-leaf/90 disabled:opacity-60"
            disabled={state === "confirming"}
            onClick={handleConfirmRecovery}
            type="button"
          >
            {state === "confirming" ? "확인하고 있어요" : "비밀번호 재설정 계속하기"}
          </button>
        </div>
      ) : null}

      {state === "missing" ? (
        <div className="mt-5 flex gap-3 rounded-lg border border-red-100 bg-red-50 px-3 py-3 text-sm leading-6 text-red-800">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">재설정 링크를 확인할 수 없어요</p>
            <p className="mt-1 text-slate-600">
              {message ?? "메일의 비밀번호 재설정 버튼을 다시 눌러 주세요. 계속 어렵다면 새 재설정 메일을 요청해 주세요."}
            </p>
          </div>
        </div>
      ) : null}

      {state === "done" ? (
        <div className="mt-5 flex gap-3 rounded-lg border border-leaf/15 bg-[#F5F8F6] px-3 py-3 text-sm leading-6 text-leaf">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">비밀번호를 바꿨어요</p>
            <p className="mt-1 text-slate-600">새 비밀번호로 다시 로그인해 주세요.</p>
          </div>
        </div>
      ) : null}

      {state === "ready" || state === "saving" ? (
        <form className="mt-5 grid gap-3" onSubmit={handleSubmit}>
          {message ? (
            <div className="flex gap-3 rounded-lg border border-red-100 bg-red-50 px-3 py-3 text-sm leading-6 text-red-800">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <p>{message}</p>
            </div>
          ) : null}

          <label className="grid gap-1 text-sm font-medium text-slate-700">
            새 비밀번호
            <input
              autoComplete="new-password"
              className="h-12 rounded-lg border border-slate-200 bg-white px-3 text-base transition focus:border-leaf/50 focus:ring-4 focus:ring-leaf/10"
              name="password"
              type="password"
            />
          </label>
          <label className="grid gap-1 text-sm font-medium text-slate-700">
            새 비밀번호 확인
            <input
              autoComplete="new-password"
              className="h-12 rounded-lg border border-slate-200 bg-white px-3 text-base transition focus:border-leaf/50 focus:ring-4 focus:ring-leaf/10"
              name="passwordConfirm"
              type="password"
            />
          </label>
          <button
            className="h-12 rounded-lg bg-leaf px-4 font-semibold text-white shadow-sm transition hover:bg-leaf/90 disabled:opacity-60"
            disabled={state === "saving"}
            type="submit"
          >
            {state === "saving" ? "저장하고 있어요" : "비밀번호 저장하기"}
          </button>
        </form>
      ) : null}
    </section>
  );
}
