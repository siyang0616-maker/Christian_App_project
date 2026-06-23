"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { actionErrorPath, getSafeInternalPath } from "@/lib/action-feedback";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createGroupSchema, joinGroupSchema } from "@/lib/validation";

type SupabaseActionError = {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
};

type CreateGroupWithLeaderRow = {
  group_id: string;
  created_group_name: string;
  group_invite_code: string;
};

function createInviteCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
}

function isMissingCreateGroupRpcError(error: SupabaseActionError) {
  const message = error.message?.toLowerCase() ?? "";

  return error.code === "PGRST202" || message.includes("create_group_with_leader") || message.includes("could not find the function");
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

  const { data: rpcGroupRows, error: rpcError } = await supabase.rpc("create_group_with_leader", {
    group_name: parsed.data.name,
  });

  if (!rpcError) {
    const group = Array.isArray(rpcGroupRows) ? (rpcGroupRows[0] as CreateGroupWithLeaderRow | undefined) : undefined;

    if (!group?.group_id) {
      console.error("Supabase create group RPC returned no group", {
        userId: user.id,
      });
      redirect(actionErrorPath("group-create"));
    }

    revalidatePath("/");
    revalidatePath("/leader");
    return;
  }

  if (!isMissingCreateGroupRpcError(rpcError)) {
    console.error("Supabase create group RPC failed", {
      code: rpcError.code,
      message: rpcError.message,
      details: rpcError.details,
      hint: rpcError.hint,
    });
    redirect(actionErrorPath("group-create"));
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
    console.error("Supabase leader membership insert failed after group create", {
      code: membershipError.code,
      message: membershipError.message,
      details: membershipError.details,
      hint: membershipError.hint,
      groupId: group.id,
      userId: user.id,
    });

    const { error: rollbackError } = await supabase.from("groups").delete().eq("id", group.id).eq("created_by", user.id);

    if (rollbackError) {
      console.error("Supabase group create rollback failed", {
        code: rollbackError.code,
        message: rollbackError.message,
        details: rollbackError.details,
        hint: rollbackError.hint,
        groupId: group.id,
        userId: user.id,
      });
    }

    redirect(actionErrorPath("group-create"));
  }

  revalidatePath("/");
  revalidatePath("/leader");
}

export async function joinGroup(formData: FormData) {
  const returnTo = getSafeInternalPath(formData.get("returnTo"));
  const parsed = joinGroupSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    redirect(actionErrorPath("invite-invalid", returnTo));
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
    redirect(actionErrorPath("invite-join", returnTo));
  }

  revalidatePath("/");
  revalidatePath("/leader");
}
