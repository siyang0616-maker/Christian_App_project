"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Route } from "next";
import { actionErrorPath } from "@/lib/action-feedback";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { profileSchema } from "@/lib/validation";

function getSafeReturnPath(value: FormDataEntryValue | null): Route {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  return value as Route;
}

export async function saveProfile(formData: FormData) {
  const returnTo = getSafeReturnPath(formData.get("returnTo"));
  const parsed = profileSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    redirect(actionErrorPath("profile-invalid"));
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    display_name: parsed.data.displayName,
  });

  if (error) {
    redirect(actionErrorPath("profile-save"));
  }

  revalidatePath("/");
  revalidatePath("/today");
  revalidatePath("/leader");
  redirect(returnTo);
}
