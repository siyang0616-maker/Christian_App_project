"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { actionErrorPath, actionSuccessPath, getSafeInternalPath } from "@/lib/action-feedback";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { leaderPrayerCareMarkSchema, prayerReactionSchema, prayerRequestSchema } from "@/lib/validation";

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
  revalidatePath("/leader");
  redirect(actionSuccessPath("prayer-saved", returnTo));
}

export async function prayForRequest(formData: FormData) {
  const returnTo = getSafeInternalPath(formData.get("returnTo"), "/#prayer-cards");
  const parsed = prayerReactionSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    redirect(actionErrorPath("prayer-reaction", returnTo));
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
    redirect(actionErrorPath("prayer-reaction", returnTo));
  }

  revalidatePath("/");
  revalidatePath("/leader");
  redirect(actionSuccessPath("prayer-reaction-saved", returnTo));
}

export async function saveLeaderPrayerCareMark(formData: FormData) {
  const returnTo = getSafeInternalPath(formData.get("returnTo"), "/leader#leader-prayer-timeline");
  const parsed = leaderPrayerCareMarkSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    redirect(actionErrorPath("prayer-care", returnTo));
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: prayer, error: prayerError } = await supabase
    .from("prayers")
    .select("id, group_id")
    .eq("id", parsed.data.prayerId)
    .maybeSingle<{ id: string; group_id: string }>();

  if (prayerError || !prayer) {
    redirect(actionErrorPath("prayer-care", returnTo));
  }

  const { error } = await supabase.from("leader_prayer_care_marks").upsert(
    {
      prayer_id: prayer.id,
      group_id: prayer.group_id,
      care_scope: parsed.data.careScope,
      is_important: parsed.data.isImportant,
      is_ongoing: parsed.data.isOngoing,
      created_by: user.id,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "prayer_id" },
  );

  if (error) {
    redirect(actionErrorPath("prayer-care", returnTo));
  }

  revalidatePath("/leader");
  redirect(actionSuccessPath("prayer-care-saved", returnTo));
}
