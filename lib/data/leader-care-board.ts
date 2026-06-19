import type {
  CheckInWithAuthor,
  GroupMemberWithProfile,
  LeaderPrayerCareMark,
  PrayerCareScope,
  PrayerReaction,
  PrayerRequestWithAuthor,
} from "@/lib/types";
import { moodLabel, visibilityLabel } from "@/lib/ui/labels";

export type LeaderInboxItem = {
  id: string;
  title: string;
  body: string;
  priorityRank: number;
  tone: "leaf" | "clay" | "blue";
};

export type LeaderPrayerTimelineItem = {
  id: string;
  authorLabel: string;
  content: string;
  visibilityLabel: string;
  createdLabel: string;
  reactionCount: number;
  alreadyPrayed: boolean;
  prayerStatusLabel: string;
  careMark: LeaderPrayerCareMark | null;
  careScope: PrayerCareScope;
  careScopeLabel: string;
  isImportant: boolean;
  isOngoing: boolean;
  isAnonymous: boolean;
  copyLabel: string | null;
  copyMessage: string | null;
  copyPreview: string | null;
};

export type LeaderPrayerDateGroup = {
  dateKey: string;
  label: string;
  prayers: LeaderPrayerTimelineItem[];
};

export type LeaderMemberCareSummary = {
  userId: string;
  displayName: string;
  latestCheckInLabel: string;
  latestMoodLabel: string | null;
  careReason: string;
  visiblePrayerCount: number;
  isQuiet: boolean;
  priorityRank: number;
  careBadgeLabel: string;
  careBadgeTone: "leaf" | "clay" | "blue";
  copyMessage: string;
  copyPreview: string;
};

export type LeaderCareBoardData = {
  totals: {
    memberCount: number;
    todayVisibleCheckInCount: number;
    todayMemberVisibleCheckInCount: number;
    visiblePrayerCount: number;
    careMarkedPrayerCount: number;
    importantPrayerCount: number;
    ongoingPrayerCount: number;
    quietMemberCount: number;
  };
  inbox: LeaderInboxItem[];
  prayerDateGroups: LeaderPrayerDateGroup[];
  memberSummaries: LeaderMemberCareSummary[];
};

type LeaderCareBoardInput = {
  members: GroupMemberWithProfile[];
  quietMembers: GroupMemberWithProfile[];
  todayCheckins: CheckInWithAuthor[];
  recentCheckIns: CheckInWithAuthor[];
  prayers: PrayerRequestWithAuthor[];
  reactions: PrayerReaction[];
  careMarks: LeaderPrayerCareMark[];
  currentUserId: string;
  now?: Date;
};

export function createLeaderCareBoardData(input: LeaderCareBoardInput): LeaderCareBoardData {
  const memberUserIds = new Set(input.members.filter((member) => member.role === "member").map((member) => member.user_id));
  const todayMemberVisibleCheckInCount = input.todayCheckins.filter((checkin) => memberUserIds.has(checkin.user_id)).length;

  return {
    totals: {
      memberCount: memberUserIds.size,
      todayVisibleCheckInCount: input.todayCheckins.length,
      todayMemberVisibleCheckInCount,
      visiblePrayerCount: input.prayers.length,
      careMarkedPrayerCount: input.careMarks.length,
      importantPrayerCount: input.careMarks.filter((mark) => mark.is_important).length,
      ongoingPrayerCount: input.careMarks.filter((mark) => mark.is_ongoing).length,
      quietMemberCount: input.quietMembers.length,
    },
    inbox: buildLeaderInbox(input),
    prayerDateGroups: groupPrayersByDate(input.prayers, input.reactions, input.careMarks, input.currentUserId, input.now),
    memberSummaries: buildMemberCareSummaries({
      members: input.members,
      quietMembers: input.quietMembers,
      recentCheckIns: input.recentCheckIns,
      prayers: input.prayers,
      now: input.now,
    }),
  };
}

export function buildLeaderInbox({
  quietMembers,
  todayCheckins,
  prayers,
}: Pick<LeaderCareBoardInput, "quietMembers" | "todayCheckins" | "prayers">): LeaderInboxItem[] {
  const needPrayerCheckIns = todayCheckins.filter((checkin) => checkin.mood === "hard" || checkin.mood === "need_prayer");
  const unansweredPrayerCount = prayers.filter((prayer) => !prayer.answered_at).length;
  const items: LeaderInboxItem[] = [];

  if (unansweredPrayerCount > 0) {
    items.push({
      id: "new-prayers",
      title: "새로 기억할 기도제목",
      body: `${unansweredPrayerCount}개의 기도제목을 함께 기억할 수 있어요.`,
      priorityRank: 1,
      tone: "clay",
    });
  }

  if (needPrayerCheckIns.length > 0) {
    items.push({
      id: "tender-checkins",
      title: "조금 더 살펴볼 안부",
      body: `${needPrayerCheckIns.length}명이 힘든 안부를 남겼어요.`,
      priorityRank: 2,
      tone: "blue",
    });
  }

  if (quietMembers.length > 0) {
    items.push({
      id: "quiet-members",
      title: "안부를 물어볼 멤버",
      body: `${quietMembers.length}명은 최근 리더에게 보이는 안부가 아직 없어요.`,
      priorityRank: 3,
      tone: "leaf",
    });
  }

  if (items.length === 0) {
    items.push({
      id: "calm-day",
      title: "오늘은 차분하게 흘러가고 있어요",
      body: "새로 급하게 살펴볼 신호는 아직 없어요.",
      priorityRank: 9,
      tone: "leaf",
    });
  }

  return items.sort((left, right) => left.priorityRank - right.priorityRank);
}

export function groupPrayersByDate(
  prayers: PrayerRequestWithAuthor[],
  reactions: PrayerReaction[],
  careMarks: LeaderPrayerCareMark[],
  currentUserId: string,
  now = new Date(),
): LeaderPrayerDateGroup[] {
  const reactionMap = buildReactionMap(reactions);
  const careMarkMap = buildCareMarkMap(careMarks);
  const today = toDateKey(now);
  const groups = new Map<string, LeaderPrayerTimelineItem[]>();

  prayers.forEach((prayer) => {
    const dateKey = toDateKey(prayer.created_at);
    const prayerReactions = reactionMap.get(prayer.id) ?? [];
    const isAnonymous = prayer.visibility === "anonymous";
    const messages = buildCopyReadyMessages(isAnonymous ? null : prayer.profiles.display_name);
    const alreadyPrayed = prayerReactions.some((reaction) => reaction.user_id === currentUserId);
    const careMark = careMarkMap.get(prayer.id) ?? null;
    const careState = buildPrayerCareState(careMark);
    const privacy = isAnonymous
      ? {
          authorLabel: "이름 숨김",
          copyLabel: null,
          copyMessage: null,
          copyPreview: null,
        }
      : {
          authorLabel: prayer.profiles.display_name,
          copyLabel: "기도 응원 문구 복사",
          copyMessage: messages.prayerSupport,
          copyPreview: messages.prayerSupport,
        };

    const timelineItem: LeaderPrayerTimelineItem = {
      id: prayer.id,
      authorLabel: privacy.authorLabel,
      content: prayer.content,
      visibilityLabel: visibilityLabel(prayer.visibility),
      createdLabel: formatCareDateLabel(prayer.created_at),
      reactionCount: prayerReactions.length,
      alreadyPrayed,
      prayerStatusLabel: buildPrayerStatusLabel(prayerReactions.length, alreadyPrayed),
      careMark,
      careScope: careState.careScope,
      careScopeLabel: careState.careScopeLabel,
      isImportant: careState.isImportant,
      isOngoing: careState.isOngoing,
      isAnonymous,
      copyLabel: privacy.copyLabel,
      copyMessage: privacy.copyMessage,
      copyPreview: privacy.copyPreview,
    };

    const group = groups.get(dateKey) ?? [];
    group.push(timelineItem);
    groups.set(dateKey, group);
  });

  return [...groups.entries()]
    .sort(([left], [right]) => right.localeCompare(left))
    .map(([dateKey, groupPrayers]) => ({
      dateKey,
      label: formatDateGroupLabel(dateKey, today),
      prayers: groupPrayers.sort(comparePrayerCarePriority),
    }));
}

export function buildMemberCareSummaries({
  members,
  quietMembers,
  recentCheckIns,
  prayers,
  now = new Date(),
}: {
  members: GroupMemberWithProfile[];
  quietMembers: GroupMemberWithProfile[];
  recentCheckIns: CheckInWithAuthor[];
  prayers: PrayerRequestWithAuthor[];
  now?: Date;
}): LeaderMemberCareSummary[] {
  const quietMemberIds = new Set(quietMembers.map((member) => member.user_id));
  const latestCheckInByUser = buildLatestCheckInByUser(recentCheckIns);
  const attributablePrayers = prayers.filter((prayer) => prayer.visibility !== "anonymous");
  const visiblePrayerCountByUser = buildPrayerCountByUser(attributablePrayers);
  const today = toDateKey(now);

  return members
    .filter((member) => member.role === "member")
    .map((member) => {
      const latestCheckIn = latestCheckInByUser.get(member.user_id) ?? null;
      const visiblePrayerCount = visiblePrayerCountByUser.get(member.user_id) ?? 0;
      const messages = buildCopyReadyMessages(member.profiles.display_name);
      const isQuiet = quietMemberIds.has(member.user_id);
      const priorityRank = buildMemberPriorityRank({ isQuiet, latestCheckIn, visiblePrayerCount });
      const careBadge = buildCareBadge({ isQuiet, latestCheckIn, visiblePrayerCount });
      const copyMessage = isQuiet ? messages.gentleCheckIn : messages.gentleResponse;

      return {
        userId: member.user_id,
        displayName: member.profiles.display_name,
        latestCheckInLabel: latestCheckIn ? formatLatestCheckIn(latestCheckIn, today) : "아직 리더에게 보이는 안부가 없어요.",
        latestMoodLabel: latestCheckIn ? moodLabel(latestCheckIn.mood) : null,
        careReason: buildCareReason({ isQuiet, latestCheckIn, visiblePrayerCount }),
        visiblePrayerCount,
        isQuiet,
        priorityRank,
        careBadgeLabel: careBadge.label,
        careBadgeTone: careBadge.tone,
        copyMessage,
        copyPreview: copyMessage,
      };
    })
    .sort((left, right) => {
      const priorityCompare = left.priorityRank - right.priorityRank;
      return priorityCompare === 0 ? left.displayName.localeCompare(right.displayName, "ko-KR") : priorityCompare;
    });
}

export function buildCopyReadyMessages(displayName: string | null) {
  const name = displayName ? `${displayName}님` : "함께 나눠준 분";

  return {
    gentleCheckIn: `${name}, 이번 주는 어떻게 지내고 있어요? 부담 없이 짧게 나눠줘도 괜찮아요.`,
    gentleResponse: `${name}, 남겨준 안부 함께 기억하고 있어요. 이번 주도 혼자 감당하지 않아도 괜찮아요.`,
    prayerSupport: `${name}, 남겨준 기도제목 함께 기억하고 기도할게요. 말해줘서 고마워요.`,
  };
}

function buildPrayerStatusLabel(reactionCount: number, alreadyPrayed: boolean) {
  if (alreadyPrayed) {
    return "기도로 기억 중";
  }

  if (reactionCount > 0) {
    return `함께 기도 ${reactionCount}명`;
  }

  return "기도 전";
}

function buildReactionMap(reactions: PrayerReaction[]) {
  const reactionMap = new Map<string, PrayerReaction[]>();

  reactions.forEach((reaction) => {
    const list = reactionMap.get(reaction.prayer_id) ?? [];
    list.push(reaction);
    reactionMap.set(reaction.prayer_id, list);
  });

  return reactionMap;
}

function buildCareMarkMap(careMarks: LeaderPrayerCareMark[]) {
  const careMarkMap = new Map<string, LeaderPrayerCareMark>();

  careMarks.forEach((mark) => {
    careMarkMap.set(mark.prayer_id, mark);
  });

  return careMarkMap;
}

function buildPrayerCareState(careMark: LeaderPrayerCareMark | null) {
  const careScope = careMark?.care_scope ?? "communal";

  return {
    careScope,
    careScopeLabel: careScope === "personal" ? "개별 돌봄" : "함께 기도",
    isImportant: careMark?.is_important ?? false,
    isOngoing: careMark?.is_ongoing ?? false,
  };
}

function comparePrayerCarePriority(left: LeaderPrayerTimelineItem, right: LeaderPrayerTimelineItem) {
  const leftRank = prayerCarePriority(left);
  const rightRank = prayerCarePriority(right);

  if (leftRank !== rightRank) {
    return leftRank - rightRank;
  }

  return right.createdLabel.localeCompare(left.createdLabel, "ko-KR");
}

function prayerCarePriority(prayer: LeaderPrayerTimelineItem) {
  if (prayer.isImportant) {
    return 1;
  }

  if (prayer.isOngoing) {
    return 2;
  }

  if (prayer.careMark) {
    return 3;
  }

  return 4;
}

function buildLatestCheckInByUser(checkins: CheckInWithAuthor[]) {
  const sortedCheckIns = [...checkins].sort((left, right) => {
    const dateCompare = right.checkin_date.localeCompare(left.checkin_date);
    return dateCompare === 0 ? right.created_at.localeCompare(left.created_at) : dateCompare;
  });
  const latestByUser = new Map<string, CheckInWithAuthor>();

  sortedCheckIns.forEach((checkin) => {
    if (!latestByUser.has(checkin.user_id)) {
      latestByUser.set(checkin.user_id, checkin);
    }
  });

  return latestByUser;
}

function buildPrayerCountByUser(prayers: PrayerRequestWithAuthor[]) {
  const countByUser = new Map<string, number>();

  prayers.forEach((prayer) => {
    countByUser.set(prayer.user_id, (countByUser.get(prayer.user_id) ?? 0) + 1);
  });

  return countByUser;
}

function buildCareReason({
  isQuiet,
  latestCheckIn,
  visiblePrayerCount,
}: {
  isQuiet: boolean;
  latestCheckIn: CheckInWithAuthor | null;
  visiblePrayerCount: number;
}) {
  if (latestCheckIn?.mood === "hard" || latestCheckIn?.mood === "need_prayer") {
    return "오늘 안부를 조금 더 살펴보면 좋아요.";
  }

  if (isQuiet) {
    return "가볍게 안부를 물어보면 좋아요.";
  }

  if (visiblePrayerCount > 0) {
    return "함께 기억할 기도제목이 있어요.";
  }

  return "최근 안부가 남겨졌어요.";
}

function buildMemberPriorityRank({
  isQuiet,
  latestCheckIn,
  visiblePrayerCount,
}: {
  isQuiet: boolean;
  latestCheckIn: CheckInWithAuthor | null;
  visiblePrayerCount: number;
}) {
  if (latestCheckIn?.mood === "hard" || latestCheckIn?.mood === "need_prayer") {
    return 1;
  }

  if (isQuiet) {
    return 2;
  }

  if (visiblePrayerCount > 0) {
    return 3;
  }

  return 4;
}

function buildCareBadge({
  isQuiet,
  latestCheckIn,
  visiblePrayerCount,
}: {
  isQuiet: boolean;
  latestCheckIn: CheckInWithAuthor | null;
  visiblePrayerCount: number;
}) {
  if (latestCheckIn?.mood === "hard" || latestCheckIn?.mood === "need_prayer") {
    return { label: "조금 더 살피기", tone: "blue" as const };
  }

  if (isQuiet) {
    return { label: "안부 기다림", tone: "leaf" as const };
  }

  if (visiblePrayerCount > 0) {
    return { label: "기도제목 있음", tone: "clay" as const };
  }

  return { label: "나눔 있음", tone: "blue" as const };
}

function formatLatestCheckIn(checkin: CheckInWithAuthor, today: string) {
  const dateKey = checkin.checkin_date;
  const dayGap = differenceInDays(dateKey, today);
  const dateLabel = dayGap === 0 ? "오늘" : dayGap === 1 ? "어제" : formatCareDateLabel(dateKey);

  return `${dateLabel} · ${moodLabel(checkin.mood)}`;
}

function formatDateGroupLabel(dateKey: string, today: string) {
  const dayGap = differenceInDays(dateKey, today);

  if (dayGap === 0) {
    return "오늘";
  }

  if (dayGap === 1) {
    return "어제";
  }

  if (dayGap < 7) {
    return "이번 주";
  }

  return "이전";
}

function formatCareDateLabel(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
    timeZone: "Asia/Seoul",
  }).format(new Date(normalizeDateInput(value)));
}

function toDateKey(value: string | Date) {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(typeof value === "string" ? new Date(value) : value);
}

function differenceInDays(fromDateKey: string, toDateKeyValue: string) {
  return Math.max(0, Math.round((dateKeyToUtcTime(toDateKeyValue) - dateKeyToUtcTime(fromDateKey)) / 86_400_000));
}

function dateKeyToUtcTime(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

function normalizeDateInput(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00+09:00` : value;
}
