"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { actionErrorPath, actionSuccessPath, getSafeInternalPath } from "@/lib/action-feedback";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { checkInSchema } from "@/lib/validation";

export async function saveCheckIn(formData: FormData) {
  const returnTo = getSafeInternalPath(formData.get("returnTo"));
  const parsed = checkInSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    redirect(actionErrorPath("checkin-invalid", returnTo));
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const today = new Date().toISOString().slice(0, 10);

  // RLS confirms the user belongs to this group before insert/update succeeds.
  const { error } = await supabase.from("checkins").upsert(
    {
      group_id: parsed.data.groupId,
      user_id: user.id,
      checkin_date: today,
      woke_up: parsed.data.woke_up,
      bible_read: parsed.data.bible_read,
      prayed: parsed.data.prayed,
      meditated: parsed.data.meditated,
      attended: parsed.data.attended,
      mood: parsed.data.mood,
      note: parsed.data.note || null,
      visibility: parsed.data.visibility,
    },
    { onConflict: "group_id,user_id,checkin_date" },
  );

  if (error) {
    redirect(actionErrorPath("checkin-save", returnTo));
  }

  revalidatePath("/");
  revalidatePath("/today");
  redirect(actionSuccessPath("checkin-saved", returnTo));
}
