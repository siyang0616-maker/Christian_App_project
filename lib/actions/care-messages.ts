"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { actionErrorPath, actionSuccessPath, getSafeInternalPath } from "@/lib/action-feedback";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { careMessageSchema } from "@/lib/validation";

export async function sendCareMessage(formData: FormData) {
  const returnTo = getSafeInternalPath(formData.get("returnTo"));
  const parsed = careMessageSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    redirect(actionErrorPath("care-message-invalid", returnTo));
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { error } = await supabase.from("care_messages").insert({
    group_id: parsed.data.groupId,
    parent_type: parsed.data.parentType,
    parent_id: parsed.data.parentId,
    thread_owner_id: parsed.data.threadOwnerId,
    sender_id: user.id,
    body: parsed.data.body,
  });

  if (error) {
    console.error("Supabase care message save failed", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });
    redirect(actionErrorPath("care-message-save", returnTo));
  }

  revalidatePath("/");
  revalidatePath("/leader");
  redirect(actionSuccessPath("care-message-saved", returnTo));
}
