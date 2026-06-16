"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { checkInSchema } from "@/lib/validation";

export async function saveCheckIn(formData: FormData) {
  const parsed = checkInSchema.parse(Object.fromEntries(formData));
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const today = new Date().toISOString().slice(0, 10);

  // RLS confirms the user belongs to this group before insert/update succeeds.
  await supabase.from("checkins").upsert(
    {
      group_id: parsed.groupId,
      user_id: user.id,
      checkin_date: today,
      woke_up: parsed.woke_up,
      bible_read: parsed.bible_read,
      prayed: parsed.prayed,
      meditated: parsed.meditated,
      attended: parsed.attended,
      mood: parsed.mood,
      note: parsed.note || null,
      visibility: parsed.visibility,
    },
    { onConflict: "group_id,user_id,checkin_date" },
  );

  revalidatePath("/");
  revalidatePath("/today");
}
