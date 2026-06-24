import type { SupabaseClient } from "@supabase/supabase-js";
import { koreaDateKey } from "@/lib/dates";
import type { Mood, TimelineDay } from "@/lib/types";

export type { TimelineDay };

type TimelineCheckInRow = {
  checkin_date: string;
  user_id: string;
  mood: Mood;
  bible_read: boolean;
  prayed: boolean;
  attended: boolean;
  created_at: string;
};

export async function getMemberTimeline(
  supabase: SupabaseClient,
  userId: string,
  groupId: string,
): Promise<TimelineDay[]> {
  const dateKeys = getTimelineDateKeys();
  const { data, error } = await supabase
    .from("checkins")
    .select("checkin_date,user_id,mood,bible_read,prayed,attended,created_at")
    .eq("group_id", groupId)
    .eq("user_id", userId)
    .gte("checkin_date", dateKeys[0])
    .lte("checkin_date", dateKeys[dateKeys.length - 1])
    .order("checkin_date", { ascending: true })
    .order("created_at", { ascending: false })
    .returns<TimelineCheckInRow[]>();

  if (error) {
    console.error("[member-timeline] checkins query failed", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });
  }

  return buildTimelineDays(data ?? [], dateKeys);
}

export async function getMemberTimelinesForGroup(
  supabase: SupabaseClient,
  groupId: string,
  userIds: string[],
): Promise<Map<string, TimelineDay[]>> {
  const dateKeys = getTimelineDateKeys();
  const timelinesByUser = new Map<string, TimelineDay[]>();

  userIds.forEach((userId) => {
    timelinesByUser.set(userId, buildTimelineDays([], dateKeys));
  });

  if (userIds.length === 0) {
    return timelinesByUser;
  }

  const { data, error } = await supabase
    .from("checkins")
    .select("checkin_date,user_id,mood,bible_read,prayed,attended,created_at")
    .eq("group_id", groupId)
    .in("user_id", userIds)
    .gte("checkin_date", dateKeys[0])
    .lte("checkin_date", dateKeys[dateKeys.length - 1])
    .order("checkin_date", { ascending: true })
    .order("created_at", { ascending: false })
    .returns<TimelineCheckInRow[]>();

  if (error) {
    console.error("[member-timeline] group checkins query failed", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });
  }

  userIds.forEach((userId) => {
    timelinesByUser.set(userId, buildTimelineDays((data ?? []).filter((row) => row.user_id === userId), dateKeys));
  });

  return timelinesByUser;
}

export function buildTimelineDays(rows: TimelineCheckInRow[], dateKeys = getTimelineDateKeys()): TimelineDay[] {
  const rowsByDate = new Map<string, TimelineCheckInRow>();

  rows.forEach((row) => {
    if (!rowsByDate.has(row.checkin_date)) {
      rowsByDate.set(row.checkin_date, row);
    }
  });

  return dateKeys.map((date) => {
    const row = rowsByDate.get(date);

    return {
      date,
      hasCheckIn: Boolean(row),
      mood: row?.mood ?? null,
      bibleRead: row?.bible_read ?? false,
      prayed: row?.prayed ?? false,
      attended: row?.attended ?? false,
    };
  });
}

function getTimelineDateKeys(now = new Date()) {
  return Array.from({ length: 28 }, (_, index) => {
    const date = new Date(now);
    date.setDate(date.getDate() - (27 - index));
    return koreaDateKey(date);
  });
}
