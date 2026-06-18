import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  CheckInWithAuthor,
  DashboardData,
  Group,
  GroupMember,
  GroupMemberWithProfile,
  PrayerReaction,
  PrayerRequestWithAuthor,
  Profile,
} from "@/lib/types";

export async function getDashboardData(supabase: SupabaseClient, userId: string): Promise<DashboardData> {
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle<Profile>();

  if (!profile) {
    return emptyDashboard(null);
  }

  const { data: membership } = await supabase
    .from("group_members")
    .select("*")
    .eq("user_id", userId)
    .order("joined_at", { ascending: false })
    .limit(1)
    .maybeSingle<GroupMember>();

  if (!membership) {
    return emptyDashboard(profile);
  }

  const [{ data: activeGroup }, { data: members }, { data: todayCheckIn }, { data: recentCheckIns }, { data: prayerRequests }] =
    await Promise.all([
      supabase.from("groups").select("*").eq("id", membership.group_id).single<Group>(),
      supabase
        .from("group_members")
        .select("*, profiles(*)")
        .eq("group_id", membership.group_id)
        .order("joined_at", { ascending: true })
        .returns<GroupMemberWithProfile[]>(),
      supabase
        .from("checkins")
        .select("*, profiles(*)")
        .eq("group_id", membership.group_id)
        .eq("user_id", userId)
        .eq("checkin_date", new Date().toISOString().slice(0, 10))
        .maybeSingle<CheckInWithAuthor>(),
      supabase
        .from("checkins")
        .select("*, profiles(*)")
        .eq("group_id", membership.group_id)
        .order("checkin_date", { ascending: false })
        .limit(12)
        .returns<CheckInWithAuthor[]>(),
      supabase
        .from("prayers")
        .select("*, profiles(*)")
        .eq("group_id", membership.group_id)
        .order("created_at", { ascending: false })
        .limit(20)
        .returns<PrayerRequestWithAuthor[]>(),
    ]);

  const prayerIds = (prayerRequests ?? []).map((prayer) => prayer.id);
  const { data: prayerReactions } =
    prayerIds.length > 0
      ? await supabase.from("prayer_reactions").select("*").in("prayer_id", prayerIds).returns<PrayerReaction[]>()
      : { data: [] };

  const recentCheckInUserIds = new Set((recentCheckIns ?? []).map((checkIn) => checkIn.user_id));
  const quietMembers = (members ?? []).filter(
    (member) => member.role === "member" && !recentCheckInUserIds.has(member.user_id),
  );

  return {
    profile,
    membership,
    activeGroup: activeGroup ?? null,
    members: members ?? [],
    quietMembers,
    todayCheckIn: todayCheckIn ?? null,
    recentCheckIns: recentCheckIns ?? [],
    prayerRequests: prayerRequests ?? [],
    prayerReactions: prayerReactions ?? [],
  };
}

function emptyDashboard(profile: Profile | null): DashboardData {
  return {
    profile,
    membership: null,
    activeGroup: null,
    members: [],
    quietMembers: [],
    todayCheckIn: null,
    recentCheckIns: [],
    prayerRequests: [],
    prayerReactions: [],
  };
}
