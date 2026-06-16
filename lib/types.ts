export type MemberRole = "leader" | "member";
export type CheckinVisibility = "private" | "leader" | "group";
export type PrayerVisibility = CheckinVisibility | "anonymous";
export type Visibility = PrayerVisibility;
export type Mood = "good" | "normal" | "hard" | "need_prayer";

export type Profile = {
  id: string;
  display_name: string;
  created_at: string;
  updated_at: string;
};

export type Group = {
  id: string;
  name: string;
  invite_code: string;
  created_by: string;
  created_at: string;
};

export type GroupMember = {
  group_id: string;
  user_id: string;
  role: MemberRole;
  joined_at: string;
};

export type GroupMemberWithProfile = GroupMember & {
  profiles: Profile;
};

export type CheckInWithAuthor = {
  id: string;
  group_id: string;
  user_id: string;
  checkin_date: string;
  mood: Mood;
  woke_up: boolean;
  bible_read: boolean;
  prayed: boolean;
  meditated: boolean;
  attended: boolean;
  note: string | null;
  visibility: CheckinVisibility;
  created_at: string;
  updated_at: string;
  profiles: Profile;
};

export type PrayerRequestWithAuthor = {
  id: string;
  group_id: string;
  user_id: string;
  content: string;
  visibility: PrayerVisibility;
  answered_at: string | null;
  created_at: string;
  updated_at: string;
  profiles: Profile;
};

export type PrayerReaction = {
  prayer_id: string;
  user_id: string;
  created_at: string;
};

export type DashboardData = {
  profile: Profile | null;
  membership: GroupMember | null;
  activeGroup: Group | null;
  members: GroupMemberWithProfile[];
  quietMembers: GroupMemberWithProfile[];
  todayCheckIn: CheckInWithAuthor | null;
  recentCheckIns: CheckInWithAuthor[];
  prayerRequests: PrayerRequestWithAuthor[];
  prayerReactions: PrayerReaction[];
};
