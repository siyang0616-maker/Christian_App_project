import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  CheckInWithAuthor,
  GroupMember,
  GroupMemberWithProfile,
  PrayerRequestWithAuthor,
  Profile,
} from "@/lib/types";

export type CheckInRow = Omit<CheckInWithAuthor, "profiles">;
export type PrayerRequestRow = Omit<PrayerRequestWithAuthor, "profiles">;

type DataQueryError = {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
};

export function logDataQueryError(scope: string, label: string, error: DataQueryError | null | undefined) {
  if (!error) {
    return;
  }

  console.error(`[${scope}] ${label} query failed`, {
    code: error.code,
    message: error.message,
    details: error.details,
    hint: error.hint,
  });
}

export function logOptionalDataQueryWarning(scope: string, label: string, error: DataQueryError | null | undefined) {
  if (!error) {
    return;
  }

  console.warn(`[${scope}] optional ${label} query skipped`, {
    code: error.code,
    message: error.message,
    details: error.details,
    hint: error.hint,
  });
}

export function fallbackProfile(id: string): Profile {
  return {
    id,
    display_name: "이름 확인 필요",
    created_at: "",
    updated_at: "",
  };
}

export async function getProfilesByIds(
  supabase: SupabaseClient,
  userIds: Array<string | null | undefined>,
  scope: string,
) {
  const uniqueUserIds = [...new Set(userIds.filter((userId): userId is string => Boolean(userId)))];

  if (uniqueUserIds.length === 0) {
    return new Map<string, Profile>();
  }

  const { data, error } = await supabase.from("profiles").select("*").in("id", uniqueUserIds).returns<Profile[]>();

  logDataQueryError(scope, "profiles", error);

  return new Map((data ?? []).map((profile) => [profile.id, profile]));
}

export function attachProfilesToMembers(
  members: GroupMember[] | null | undefined,
  profilesById: Map<string, Profile>,
): GroupMemberWithProfile[] {
  return (members ?? []).map((member) => ({
    ...member,
    profiles: profilesById.get(member.user_id) ?? fallbackProfile(member.user_id),
  }));
}

export function attachProfilesToCheckIns(
  checkIns: CheckInRow[] | null | undefined,
  profilesById: Map<string, Profile>,
): CheckInWithAuthor[] {
  return (checkIns ?? []).map((checkIn) => ({
    ...checkIn,
    profiles: profilesById.get(checkIn.user_id) ?? fallbackProfile(checkIn.user_id),
  }));
}

export function attachProfileToCheckIn(
  checkIn: CheckInRow | null | undefined,
  profilesById: Map<string, Profile>,
): CheckInWithAuthor | null {
  if (!checkIn) {
    return null;
  }

  return {
    ...checkIn,
    profiles: profilesById.get(checkIn.user_id) ?? fallbackProfile(checkIn.user_id),
  };
}

export function attachProfilesToPrayers(
  prayers: PrayerRequestRow[] | null | undefined,
  profilesById: Map<string, Profile>,
): PrayerRequestWithAuthor[] {
  return (prayers ?? []).map((prayer) => ({
    ...prayer,
    profiles: profilesById.get(prayer.user_id) ?? fallbackProfile(prayer.user_id),
  }));
}
