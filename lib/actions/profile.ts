"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { profileSchema } from "@/lib/validation";

export async function saveProfile(formData: FormData) {
  const parsed = profileSchema.parse(Object.fromEntries(formData));
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  await supabase.from("profiles").upsert({
    id: user.id,
    display_name: parsed.displayName,
  });

  revalidatePath("/");
}
