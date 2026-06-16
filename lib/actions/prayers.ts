"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { prayerReactionSchema, prayerRequestSchema } from "@/lib/validation";

export async function createPrayerRequest(formData: FormData) {
  const parsed = prayerRequestSchema.parse(Object.fromEntries(formData));
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Visibility is persisted and enforced again by Postgres RLS policies.
  await supabase.from("prayers").insert({
    group_id: parsed.groupId,
    user_id: user.id,
    content: parsed.content,
    visibility: parsed.visibility,
  });

  revalidatePath("/");
}

export async function prayForRequest(formData: FormData) {
  const parsed = prayerReactionSchema.parse(Object.fromEntries(formData));
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  await supabase.from("prayer_reactions").upsert(
    {
      prayer_id: parsed.prayerId,
      user_id: user.id,
    },
    { onConflict: "prayer_id,user_id", ignoreDuplicates: true },
  );

  revalidatePath("/");
}
