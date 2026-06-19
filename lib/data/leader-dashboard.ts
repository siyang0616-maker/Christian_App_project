import type { SupabaseClient } from "@supabase/supabase-js";
import { createLeaderCareBoardData, type LeaderCareBoardData } from "@/lib/data/leader-care-board";
import {
  attachProfilesToCheckIns,
  attachProfilesToMembers,
  attachProfilesToPrayers,
  getProfilesByIds,
  logDataQueryError,
  type CheckInRow,
  type PrayerRequestRow,
} from "@/lib/data/profile-joins";
import type {
  CheckInWithAuthor,
  Group,
  GroupMember,
  GroupMemberWithProfile,
  PrayerReaction,
  PrayerRequestWithAuthor,
  Profile,
} from "@/lib/types";

export type LeaderDashboardData = {
  profile: Profile | null;
  membership: GroupMember | null;
  activeGroup: Group | null;
  members: GroupMemberWithProfile[];
  totalMembers: number;
  todayCheckins: CheckInWithAuthor[];
  recentCheckIns: CheckInWithAuthor[];
  quietMembers: GroupMemberWithProfile[];
  prayersToRemember: PrayerRequestWithAuthor[];
  prayerReactions: PrayerReaction[];
  careBoard: LeaderCareBoardData;
  metrics: {
    todayCheckinCount: number;
    bibleReadCount: number;
    prayerCount: number;
    meditationCount: number;
    needPrayerMoodCount: number;
    newPrayersThisWeek: number;
    answeredPrayersThisWeek: number;
  };
};

export async function getLeaderDashboardData(supabase: SupabaseClient, userId: string): Promise<LeaderDashboardData> {
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle<Profile>();

  logDataQueryError("leader-dashboard", "profile", profileError);

  if (!profile) {
    return emptyLeaderDashboard(null, userId);
  }

  const { data: membership, error: membershipError } = await supabase
    .from("group_members")
    .select("*")
    .eq("user_id", userId)
    .eq("role", "leader")
    .order("joined_at", { ascending: false })
    .limit(1)
    .maybeSingle<GroupMember>();

  logDataQueryError("leader-dashboard", "membership", membershipError);

  if (!membership) {
    return emptyLeaderDashboard(profile, userId);
  }

  const today = koreaDateKey(new Date());
  const weekStart = daysAgoIso(6);
  const quietCutoff = daysAgoDate(2);

  const [
    activeGroupResult,
    membersResult,
    todayCheckinsResult,
    recentCheckinsResult,
    newPrayersThisWeekResult,
    answeredPrayersThisWeekResult,
    prayersToRememberResult,
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
      .eq("checkin_date", today)
      .returns<CheckInRow[]>(),
    supabase
      .from("checkins")
      .select("*")
      .eq("group_id", membership.group_id)
      .order("checkin_date", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(24)
      .returns<CheckInRow[]>(),
    supabase
      .from("prayers")
      .select("id", { count: "exact", head: true })
      .eq("group_id", membership.group_id)
      .gte("created_at", weekStart),
    supabase
      .from("prayers")
      .select("id", { count: "exact", head: true })
      .eq("group_id", membership.group_id)
      .gte("answered_at", weekStart),
    supabase
      .from("prayers")
      .select("*")
      .eq("group_id", membership.group_id)
      .is("answered_at", null)
      .order("created_at", { ascending: false })
      .limit(20)
      .returns<PrayerRequestRow[]>(),
  ]);

  logDataQueryError("leader-dashboard", "active_group", activeGroupResult.error);
  logDataQueryError("leader-dashboard", "members", membersResult.error);
  logDataQueryError("leader-dashboard", "today_checkins", todayCheckinsResult.error);
  logDataQueryError("leader-dashboard", "recent_checkins", recentCheckinsResult.error);
  logDataQueryError("leader-dashboard", "new_prayers_this_week", newPrayersThisWeekResult.error);
  logDataQueryError("leader-dashboard", "answered_prayers_this_week", answeredPrayersThisWeekResult.error);
  logDataQueryError("leader-dashboard", "prayers_to_remember", prayersToRememberResult.error);

  const members = membersResult.data ?? [];
  const todayCheckins = todayCheckinsResult.data ?? [];
  const recentCheckIns = recentCheckinsResult.data ?? [];
  const prayersToRemember = prayersToRememberResult.data ?? [];
  const prayerReactions = await getPrayerReactions(supabase, prayersToRemember.map((prayer) => prayer.id));

  const profilesById = await getProfilesByIds(
    supabase,
    [
      userId,
      ...members.map((member) => member.user_id),
      ...todayCheckins.map((checkin) => checkin.user_id),
      ...recentCheckIns.map((checkin) => checkin.user_id),
      ...prayersToRemember.filter((prayer) => prayer.visibility !== "anonymous").map((prayer) => prayer.user_id),
    ],
    "leader-dashboard",
  );

  const membersWithProfiles = attachProfilesToMembers(members, profilesById);
  const todayCheckinsWithProfiles = attachProfilesToCheckIns(todayCheckins, profilesById);
  const recentCheckInsWithProfiles = attachProfilesToCheckIns(recentCheckIns, profilesById);
  const prayersToRememberWithProfiles = attachProfilesToPrayers(prayersToRemember, profilesById);
  const checkedInRecently = new Set(
    recentCheckInsWithProfiles
      .filter((checkin) => checkin.checkin_date >= quietCutoff)
      .map((checkin) => checkin.user_id),
  );
  const quietMembers = membersWithProfiles.filter(
    (member) => member.role === "member" && !checkedInRecently.has(member.user_id),
  );
  const careBoard = createLeaderCareBoardData({
    members: membersWithProfiles,
    quietMembers,
    todayCheckins: todayCheckinsWithProfiles,
    recentCheckIns: recentCheckInsWithProfiles,
    prayers: prayersToRememberWithProfiles,
    reactions: prayerReactions,
    currentUserId: userId,
  });

  return {
    profile,
    membership,
    activeGroup: activeGroupResult.data ?? null,
    members: membersWithProfiles,
    totalMembers: membersWithProfiles.length,
    todayCheckins: todayCheckinsWithProfiles,
    recentCheckIns: recentCheckInsWithProfiles,
    quietMembers,
    prayersToRemember: prayersToRememberWithProfiles,
    prayerReactions,
    careBoard,
    metrics: {
      todayCheckinCount: todayCheckinsWithProfiles.length,
      bibleReadCount: countToday(todayCheckinsWithProfiles, "bible_read"),
      prayerCount: countToday(todayCheckinsWithProfiles, "prayed"),
      meditationCount: countToday(todayCheckinsWithProfiles, "meditated"),
      needPrayerMoodCount: todayCheckinsWithProfiles.filter((checkin) => checkin.mood === "need_prayer").length,
      newPrayersThisWeek: newPrayersThisWeekResult.count ?? 0,
      answeredPrayersThisWeek: answeredPrayersThisWeekResult.count ?? 0,
    },
  };
}

async function getPrayerReactions(supabase: SupabaseClient, prayerIds: string[]) {
  if (prayerIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("prayer_reactions")
    .select("*")
    .in("prayer_id", prayerIds)
    .returns<PrayerReaction[]>();

  logDataQueryError("leader-dashboard", "prayer_reactions", error);
  return data ?? [];
}

function countToday(checkins: CheckInWithAuthor[] | null, field: "bible_read" | "prayed" | "meditated") {
  return (checkins ?? []).filter((checkin) => checkin[field]).length;
}

function daysAgoDate(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return koreaDateKey(date);
}

function daysAgoIso(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(0, 0, 0, 0);
  return date.toISOString();
}

function koreaDateKey(date: Date) {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function emptyLeaderDashboard(profile: Profile | null, userId: string): LeaderDashboardData {
  const careBoard = createLeaderCareBoardData({
    members: [],
    quietMembers: [],
    todayCheckins: [],
    recentCheckIns: [],
    prayers: [],
    reactions: [],
    currentUserId: userId,
  });

  return {
    profile,
    membership: null,
    activeGroup: null,
    members: [],
    totalMembers: 0,
    todayCheckins: [],
    recentCheckIns: [],
    quietMembers: [],
    prayersToRemember: [],
    prayerReactions: [],
    careBoard,
    metrics: {
      todayCheckinCount: 0,
      bibleReadCount: 0,
      prayerCount: 0,
      meditationCount: 0,
      needPrayerMoodCount: 0,
      newPrayersThisWeek: 0,
      answeredPrayersThisWeek: 0,
    },
  };
}
