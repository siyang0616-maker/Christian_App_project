import type { SupabaseClient } from "@supabase/supabase-js";
import type { CheckInWithAuthor, Group, GroupMember, GroupMemberWithProfile, PrayerRequestWithAuthor, Profile } from "@/lib/types";

export type LeaderDashboardData = {
  profile: Profile | null;
  membership: GroupMember | null;
  activeGroup: Group | null;
  totalMembers: number;
  todayCheckins: CheckInWithAuthor[];
  quietMembers: GroupMemberWithProfile[];
  prayersToRemember: PrayerRequestWithAuthor[];
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
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle<Profile>();

  if (!profile) {
    return emptyLeaderDashboard(null);
  }

  const { data: membership } = await supabase
    .from("group_members")
    .select("*")
    .eq("user_id", userId)
    .eq("role", "leader")
    .order("joined_at", { ascending: true })
    .limit(1)
    .maybeSingle<GroupMember>();

  if (!membership) {
    return emptyLeaderDashboard(profile);
  }

  const today = new Date().toISOString().slice(0, 10);
  const weekStart = daysAgoIso(6);
  const quietCutoff = daysAgoDate(2);

  const [
    { data: activeGroup },
    { data: members },
    { data: todayCheckins },
    { data: recentCheckins },
    { count: newPrayersThisWeek },
    { count: answeredPrayersThisWeek },
    { data: prayersToRemember },
  ] = await Promise.all([
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
      .eq("checkin_date", today)
      .returns<CheckInWithAuthor[]>(),
    supabase
      .from("checkins")
      .select("user_id")
      .eq("group_id", membership.group_id)
      .gte("checkin_date", quietCutoff)
      .returns<Array<Pick<CheckInWithAuthor, "user_id">>>(),
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
      .select("*, profiles(*)")
      .eq("group_id", membership.group_id)
      .is("answered_at", null)
      .order("created_at", { ascending: false })
      .limit(8)
      .returns<PrayerRequestWithAuthor[]>(),
  ]);

  const checkedInRecently = new Set((recentCheckins ?? []).map((checkin) => checkin.user_id));
  const quietMembers = (members ?? []).filter((member) => !checkedInRecently.has(member.user_id));

  return {
    profile,
    membership,
    activeGroup: activeGroup ?? null,
    totalMembers: members?.length ?? 0,
    todayCheckins: todayCheckins ?? [],
    quietMembers,
    prayersToRemember: prayersToRemember ?? [],
    metrics: {
      todayCheckinCount: todayCheckins?.length ?? 0,
      bibleReadCount: countToday(todayCheckins, "bible_read"),
      prayerCount: countToday(todayCheckins, "prayed"),
      meditationCount: countToday(todayCheckins, "meditated"),
      needPrayerMoodCount: (todayCheckins ?? []).filter((checkin) => checkin.mood === "need_prayer").length,
      newPrayersThisWeek: newPrayersThisWeek ?? 0,
      answeredPrayersThisWeek: answeredPrayersThisWeek ?? 0,
    },
  };
}

function countToday(checkins: CheckInWithAuthor[] | null, field: "bible_read" | "prayed" | "meditated") {
  return (checkins ?? []).filter((checkin) => checkin[field]).length;
}

function daysAgoDate(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
}

function daysAgoIso(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(0, 0, 0, 0);
  return date.toISOString();
}

function emptyLeaderDashboard(profile: Profile | null): LeaderDashboardData {
  return {
    profile,
    membership: null,
    activeGroup: null,
    totalMembers: 0,
    todayCheckins: [],
    quietMembers: [],
    prayersToRemember: [],
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
