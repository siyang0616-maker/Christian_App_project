"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { emailPasswordSchema } from "@/lib/validation";

type AuthErrorCode =
  | "invalid"
  | "login"
  | "login-email-unconfirmed"
  | "signup"
  | "signup-config"
  | "signup-disabled"
  | "signup-rate-limit";

function redirectWithError(code: AuthErrorCode): never {
  redirect(`/?error=${code}`);
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

function getLoginErrorCode(error: { message?: string; code?: string }): AuthErrorCode {
  const message = error.message?.toLowerCase() ?? "";
  const code = error.code?.toLowerCase() ?? "";

  console.error("Supabase login failed", {
    code: error.code,
    message: error.message,
  });

  if (code.includes("email_not_confirmed") || message.includes("email not confirmed")) {
    return "login-email-unconfirmed";
  }

  return "login";
}

async function getEmailRedirectTo() {
  const headerStore = await headers();
  const origin = headerStore.get("origin");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");

  return origin ? `${origin}/auth/callback` : siteUrl ? `${siteUrl}/auth/callback` : undefined;
}

export async function submitAuth(formData: FormData) {
  const intent = formData.get("intent") === "signUp" ? "signUp" : "signIn";
  const parsed = emailPasswordSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    redirectWithError("invalid");
  }

  const supabase = await createServerSupabaseClient();

  if (intent === "signUp") {
    const emailRedirectTo = await getEmailRedirectTo();
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: emailRedirectTo ? { emailRedirectTo } : undefined,
    });

    if (error) {
      redirectWithError(getSignupErrorCode(error));
    }

    if (!data.session) {
      redirect("/?notice=check-email");
    }

    redirect("/");
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    redirectWithError(getLoginErrorCode(error));
  }

  redirect("/");
}

export async function signOut() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/");
}
