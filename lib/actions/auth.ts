"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { emailPasswordSchema } from "@/lib/validation";

function redirectWithError(code: "invalid" | "login" | "signup"): never {
  redirect(`/?error=${code}`);
}

async function getEmailRedirectTo() {
  const headerStore = await headers();
  const origin = headerStore.get("origin");

  return origin ? `${origin}/auth/callback` : undefined;
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
      redirectWithError("signup");
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
    redirectWithError("login");
  }

  redirect("/");
}

export async function signOut() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/");
}
