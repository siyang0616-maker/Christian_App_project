"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { actionErrorPath, actionSuccessPath, getSafeInternalPath } from "@/lib/action-feedback";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { prayerReactionSchema, prayerRequestSchema } from "@/lib/validation";

export async function createPrayerRequest(formData: FormData) {
  const returnTo = getSafeInternalPath(formData.get("returnTo"));
  const parsed = prayerRequestSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    redirect(actionErrorPath("prayer-invalid", returnTo));
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Visibility is persisted and enforced again by Postgres RLS policies.
  const { error } = await supabase.from("prayers").insert({
    group_id: parsed.data.groupId,
    user_id: user.id,
    content: parsed.data.content,
    visibility: parsed.data.visibility,
  });

  if (error) {
    redirect(actionErrorPath("prayer-save", returnTo));
  }

  revalidatePath("/");
  redirect(actionSuccessPath("prayer-saved", returnTo));
}

export async function prayForRequest(formData: FormData) {
  const parsed = prayerReactionSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    redirect(actionErrorPath("prayer-reaction", "/#prayer-cards"));
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { error } = await supabase.from("prayer_reactions").upsert(
    {
      prayer_id: parsed.data.prayerId,
      user_id: user.id,
    },
    { onConflict: "prayer_id,user_id", ignoreDuplicates: true },
  );

  if (error) {
    redirect(actionErrorPath("prayer-reaction", "/#prayer-cards"));
  }

  revalidatePath("/");
  redirect(actionSuccessPath("prayer-reaction-saved", "/#prayer-cards"));
}
