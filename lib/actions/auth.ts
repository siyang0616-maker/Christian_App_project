"use server";

import type { Route } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSafeInternalPath } from "@/lib/action-feedback";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { emailOnlySchema, emailPasswordSchema } from "@/lib/validation";

type AuthErrorCode =
  | "invalid"
  | "login"
  | "login-email-unconfirmed"
  | "login-invalid"
  | "login-rate-limit"
  | "reset"
  | "reset-config"
  | "reset-invalid"
  | "reset-rate-limit"
  | "signup"
  | "signup-config"
  | "signup-disabled"
  | "signup-rate-limit";

function authFeedbackPath(key: "error" | "notice", code: string, returnTo: Route = "/") {
  const safeReturnTo = getSafeInternalPath(returnTo);
  const [path, hash = ""] = safeReturnTo.split("#");
  const separator = path.includes("?") ? "&" : "?";

  return `${path}${separator}${key}=${code}${hash ? `#${hash}` : ""}` as Route;
}

function redirectWithError(code: AuthErrorCode, returnTo: Route = "/"): never {
  redirect(authFeedbackPath("error", code, returnTo));
}

function getSignupErrorCode(error: { message?: string; status?: number; code?: string }): AuthErrorCode {
  const message = error.message?.toLowerCase() ?? "";
  const code = error.code?.toLowerCase() ?? "";

  console.error("Supabase signup failed", {
    code: error.code,
    message: error.message,
    status: error.status,
  });

  if (error.status === 429 || message.includes("rate limit") || message.includes("too many")) {
    return "signup-rate-limit";
  }

  if (message.includes("email signups are disabled") || message.includes("signup is disabled")) {
    return "signup-disabled";
  }

  if (
    code.includes("validation") ||
    message.includes("redirect") ||
    message.includes("not allowed") ||
    message.includes("failed to fetch") ||
    message.includes("invalid url")
  ) {
    return "signup-config";
  }

  return "signup";
}

function getLoginErrorCode(error: { message?: string; status?: number; code?: string }): AuthErrorCode {
  const message = error.message?.toLowerCase() ?? "";
  const code = error.code?.toLowerCase() ?? "";

  console.error("Supabase login failed", {
    code: error.code,
    message: error.message,
  });

  if (code.includes("email_not_confirmed") || message.includes("email not confirmed")) {
    return "login-email-unconfirmed";
  }

  if (error.status === 429 || message.includes("rate limit") || message.includes("too many")) {
    return "login-rate-limit";
  }

  if (code.includes("invalid_credentials") || message.includes("invalid login credentials")) {
    return "login-invalid";
  }

  return "login";
}

async function getAppBaseUrl() {
  const headerStore = await headers();
  const origin = headerStore.get("origin");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");

  if (process.env.NODE_ENV === "production" && siteUrl) {
    return siteUrl;
  }

  return origin ?? siteUrl;
}

async function getEmailRedirectTo(returnTo: Route) {
  const appBaseUrl = await getAppBaseUrl();

  return appBaseUrl ? `${appBaseUrl}/auth/callback?next=${encodeURIComponent(returnTo)}` : undefined;
}

async function getPasswordResetRedirectTo() {
  const appBaseUrl = await getAppBaseUrl();

  return appBaseUrl ? `${appBaseUrl}/auth/reset-password` : undefined;
}

function getPasswordResetErrorCode(error: { message?: string; status?: number; code?: string }): AuthErrorCode {
  const message = error.message?.toLowerCase() ?? "";

  console.error("Supabase password reset failed", {
    code: error.code,
    message: error.message,
    status: error.status,
  });

  if (error.status === 429 || message.includes("rate limit") || message.includes("too many")) {
    return "reset-rate-limit";
  }

  if (
    message.includes("redirect") ||
    message.includes("not allowed") ||
    message.includes("failed to fetch") ||
    message.includes("invalid url")
  ) {
    return "reset-config";
  }

  return "reset";
}

export async function submitAuth(formData: FormData) {
  const intent = formData.get("intent") === "signUp" ? "signUp" : "signIn";
  const returnTo = getSafeInternalPath(formData.get("returnTo"));
  const parsed = emailPasswordSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    redirectWithError("invalid", returnTo);
  }

  const supabase = await createServerSupabaseClient();

  if (intent === "signUp") {
    const emailRedirectTo = await getEmailRedirectTo(returnTo);
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: emailRedirectTo ? { emailRedirectTo } : undefined,
    });

    if (error) {
      redirectWithError(getSignupErrorCode(error), returnTo);
    }

    if (!data.session) {
      redirect(authFeedbackPath("notice", "check-email", returnTo));
    }

    redirect(returnTo);
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    redirectWithError(getLoginErrorCode(error), returnTo);
  }

  redirect(returnTo);
}

export async function requestPasswordReset(formData: FormData) {
  const parsed = emailOnlySchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    redirectWithError("reset-invalid");
  }

  const supabase = await createServerSupabaseClient();
  const redirectTo = await getPasswordResetRedirectTo();
  const { error } = await supabase.auth.resetPasswordForEmail(
    parsed.data.email,
    redirectTo ? { redirectTo } : undefined,
  );

  if (error) {
    redirectWithError(getPasswordResetErrorCode(error));
  }

  redirect("/?notice=reset-email");
}

export async function signOut() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/");
}
