"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { actionErrorPath } from "@/lib/action-feedback";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createGroupSchema, joinGroupSchema } from "@/lib/validation";

function createInviteCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
}

export async function createGroup(formData: FormData) {
  const parsed = createGroupSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    redirect(actionErrorPath("group-invalid"));
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: group, error: groupError } = await supabase
    .from("groups")
    .insert({ name: parsed.data.name, invite_code: createInviteCode(), created_by: user.id })
    .select("id")
    .single();

  if (groupError || !group) {
    redirect(actionErrorPath("group-create"));
  }

  const { error: membershipError } = await supabase
    .from("group_members")
    .insert({ group_id: group.id, user_id: user.id, role: "leader" });

  if (membershipError) {
    redirect(actionErrorPath("group-create"));
  }

  revalidatePath("/");
  revalidatePath("/leader");
}

export async function joinGroup(formData: FormData) {
  const parsed = joinGroupSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    redirect(actionErrorPath("invite-invalid"));
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: joinedGroupId, error } = await supabase.rpc("join_group_by_code", {
    raw_invite_code: parsed.data.inviteCode.toUpperCase(),
  });

  if (error || !joinedGroupId) {
    redirect(actionErrorPath("invite-join"));
  }

  revalidatePath("/");
  revalidatePath("/leader");
}
