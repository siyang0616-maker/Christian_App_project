"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createGroupSchema, joinGroupSchema } from "@/lib/validation";

function createInviteCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
}

export async function createGroup(formData: FormData) {
  const parsed = createGroupSchema.parse(Object.fromEntries(formData));
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: group } = await supabase
    .from("groups")
    .insert({ name: parsed.name, invite_code: createInviteCode(), created_by: user.id })
    .select("id")
    .single();

  if (group) {
    await supabase.from("group_members").insert({ group_id: group.id, user_id: user.id, role: "leader" });
  }

  revalidatePath("/");
}

export async function joinGroup(formData: FormData) {
  const parsed = joinGroupSchema.parse(Object.fromEntries(formData));
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  await supabase.rpc("join_group_by_code", { raw_invite_code: parsed.inviteCode.toUpperCase() });

  revalidatePath("/");
}
