import type { SupabaseClient } from "@supabase/supabase-js";
import { getCareMessagesForParents } from "@/lib/data/care-messages";
import { getMemberTimeline } from "@/lib/data/member-timeline";
import {
  attachProfileToCheckIn,
  attachProfilesToCheckIns,
  attachProfilesToMembers,
  attachProfilesToPrayers,
  getProfilesByIds,
  logDataQueryError,
  type CheckInRow,
  type PrayerRequestRow,
} from "@/lib/data/profile-joins";
import { koreaDateKey } from "@/lib/dates";
import type { DashboardData, Group, GroupMember, PrayerReaction, Profile } from "@/lib/types";

export async function getDashboardData(supabase: SupabaseClient, userId: string): Promise<DashboardData> {
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle<Profile>();

  logDataQueryError("dashboard", "profile", profileError);

  if (!profile) {
    return emptyDashboard(null);
  }

  const { data: membership, error: membershipError } = await supabase
    .from("group_members")
    .select("*")
    .eq("user_id", userId)
    .order("joined_at", { ascending: false })
    .limit(1)
    .maybeSingle<GroupMember>();

  logDataQueryError("dashboard", "membership", membershipError);

  if (!membership) {
    return emptyDashboard(profile);
  }

  const [
    activeGroupResult,
    membersResult,
    todayCheckInResult,
    recentCheckInsResult,
    prayerRequestsResult,
  ] = await Promise.all([
    supabase.from("groups").select("*").eq("id", membership.group_id).single<Group>(),
    supabase
      .from("group_members")
      .select("*")
      .eq("group_id", membership.group_id)
      .order("joined_at", { ascending: true })
      .returns<GroupMember[]>(),
    supabase
      .from("checkins")
      .select("*")
      .eq("group_id", membership.group_id)
      .eq("user_id", userId)
      .eq("checkin_date", koreaDateKey())
      .maybeSingle<CheckInRow>(),
    supabase
      .from("checkins")
      .select("*")
      .eq("group_id", membership.group_id)
      .order("checkin_date", { ascending: false })
      .limit(12)
      .returns<CheckInRow[]>(),
    supabase
      .from("prayers")
      .select("*")
      .eq("group_id", membership.group_id)
      .order("created_at", { ascending: false })
      .limit(20)
      .returns<PrayerRequestRow[]>(),
  ]);

  logDataQueryError("dashboard", "active_group", activeGroupResult.error);
  logDataQueryError("dashboard", "members", membersResult.error);
  logDataQueryError("dashboard", "today_checkin", todayCheckInResult.error);
  logDataQueryError("dashboard", "recent_checkins", recentCheckInsResult.error);
  logDataQueryError("dashboard", "prayer_requests", prayerRequestsResult.error);

  const activeGroup = activeGroupResult.data ?? null;
  const members = membersResult.data ?? [];
  const todayCheckIn = todayCheckInResult.data ?? null;
  const recentCheckIns = recentCheckInsResult.data ?? [];
  const prayerRequests = prayerRequestsResult.data ?? [];

  const profilesById = await getProfilesByIds(
    supabase,
    [
      userId,
      ...members.map((member) => member.user_id),
      todayCheckIn?.user_id,
      ...recentCheckIns.map((checkIn) => checkIn.user_id),
      ...prayerRequests.map((prayer) => prayer.user_id),
    ],
    "dashboard",
  );

  const membersWithProfiles = attachProfilesToMembers(members, profilesById);
  const todayCheckInWithProfile = attachProfileToCheckIn(todayCheckIn, profilesById);
  const recentCheckInsWithProfiles = attachProfilesToCheckIns(recentCheckIns, profilesById);
  const prayerRequestsWithProfiles = attachProfilesToPrayers(prayerRequests, profilesById);

  const prayerIds = prayerRequestsWithProfiles.map((prayer) => prayer.id);
  let prayerReactions: PrayerReaction[] = [];
  const careMessageParents = [
    ...recentCheckInsWithProfiles.map((checkIn) => ({ parentType: "checkin" as const, parentId: checkIn.id })),
    ...prayerRequestsWithProfiles.map((prayer) => ({ parentType: "prayer" as const, parentId: prayer.id })),
  ];
  const careMessages = activeGroup
    ? await getCareMessagesForParents(supabase, activeGroup.id, careMessageParents, "dashboard")
    : [];
  const memberTimeline = activeGroup ? await getMemberTimeline(supabase, userId, activeGroup.id) : [];

  if (prayerIds.length > 0) {
    const { data, error } = await supabase
      .from("prayer_reactions")
      .select("*")
      .in("prayer_id", prayerIds)
      .returns<PrayerReaction[]>();

    logDataQueryError("dashboard", "prayer_reactions", error);
    prayerReactions = data ?? [];
  }

  const recentCheckInUserIds = new Set(recentCheckInsWithProfiles.map((checkIn) => checkIn.user_id));
  const quietMembers = membersWithProfiles.filter(
    (member) => member.role === "member" && !recentCheckInUserIds.has(member.user_id),
  );

  return {
    profile,
    membership,
    activeGroup,
    members: membersWithProfiles,
    quietMembers,
    todayCheckIn: todayCheckInWithProfile,
    recentCheckIns: recentCheckInsWithProfiles,
    prayerRequests: prayerRequestsWithProfiles,
    prayerReactions,
    careMessages,
    memberTimeline,
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
    careMessages: [],
    memberTimeline: [],
  };
}
