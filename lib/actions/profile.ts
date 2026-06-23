"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { actionErrorPath, getSafeInternalPath } from "@/lib/action-feedback";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { profileSchema } from "@/lib/validation";

export async function saveProfile(formData: FormData) {
  const returnTo = getSafeInternalPath(formData.get("returnTo"));
  const parsed = profileSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    redirect(actionErrorPath("profile-invalid", returnTo));
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
    console.error("Supabase profile save failed", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });
    redirect(actionErrorPath("profile-save", returnTo));
  }

  revalidatePath("/");
  revalidatePath("/today");
  revalidatePath("/leader");
  redirect(returnTo);
}
