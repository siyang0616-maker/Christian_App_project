import type { SupabaseClient } from "@supabase/supabase-js";
import { getProfilesByIds, logDataQueryError } from "@/lib/data/profile-joins";
import type { CareMessage, CareMessageParentType, CareMessageWithSender, Profile } from "@/lib/types";

export type CareMessageParent = {
  parentType: CareMessageParentType;
  parentId: string;
};

export function careMessageParentKey(parentType: CareMessageParentType, parentId: string) {
  return `${parentType}:${parentId}`;
}

export async function getCareMessagesForParent(
  supabase: SupabaseClient,
  parentType: CareMessageParentType,
  parentId: string,
): Promise<CareMessageWithSender[]> {
  const { data, error } = await supabase
    .from("care_messages")
    .select("*")
    .eq("parent_type", parentType)
    .eq("parent_id", parentId)
    .order("created_at", { ascending: true })
    .returns<CareMessage[]>();

  logDataQueryError("care-messages", "care_messages", error);
  return attachSenderProfiles(supabase, data ?? [], "care-messages");
}

export async function getCareMessagesForParents(
  supabase: SupabaseClient,
  groupId: string,
  parents: CareMessageParent[],
  scope = "care-messages",
): Promise<CareMessageWithSender[]> {
  const parentIds = [...new Set(parents.map((parent) => parent.parentId))];

  if (parentIds.length === 0) {
    return [];
  }

  const allowedParentKeys = new Set(
    parents.map((parent) => careMessageParentKey(parent.parentType, parent.parentId)),
  );
  const { data, error } = await supabase
    .from("care_messages")
    .select("*")
    .eq("group_id", groupId)
    .in("parent_id", parentIds)
    .order("created_at", { ascending: true })
    .returns<CareMessage[]>();

  logDataQueryError(scope, "care_messages", error);

  const messages = (data ?? []).filter((message) =>
    allowedParentKeys.has(careMessageParentKey(message.parent_type, message.parent_id)),
  );

  return attachSenderProfiles(supabase, messages, scope);
}

async function attachSenderProfiles(
  supabase: SupabaseClient,
  messages: CareMessage[],
  scope: string,
): Promise<CareMessageWithSender[]> {
  if (messages.length === 0) {
    return [];
  }

  const profilesById = await getProfilesByIds(
    supabase,
    messages.map((message) => message.sender_id),
    scope,
  );

  return messages.map((message) => ({
    ...message,
    profiles: profilesById.get(message.sender_id) ?? fallbackProfile(message.sender_id, message.created_at),
  }));
}

function fallbackProfile(id: string, timestamp: string): Profile {
  return {
    id,
    display_name: "알 수 없음",
    created_at: timestamp,
    updated_at: timestamp,
  };
}
