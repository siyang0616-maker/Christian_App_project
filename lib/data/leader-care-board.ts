import type {
  CareMessageParentType,
  CareMessageWithSender,
  CheckInWithAuthor,
  GroupMemberWithProfile,
  LeaderPrayerCareMark,
  PrayerCareScope,
  PrayerReaction,
  PrayerRequestWithAuthor,
  TimelineDay,
} from "@/lib/types";
import { hasCareSignal } from "@/lib/care-signals";
import { moodLabel, visibilityLabel } from "@/lib/ui/labels";

export type LeaderInboxItem = {
  id: string;
  title: string;
  body: string;
  priorityRank: number;
  tone: "leaf" | "clay" | "blue";
};

export type LeaderCareThreadPreview = {
  parentType: CareMessageParentType;
  parentId: string;
  groupId: string;
  threadOwnerId: string;
  messageCount: number;
  lastMessageBody: string;
  lastMessageSenderId: string;
  lastMessageSenderName: string;
  lastMessageCreatedAt: string;
  waitingForLeaderResponse: boolean;
  messages: CareMessageWithSender[];
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

type RhythmKey = "woke_up" | "bible_read" | "prayed" | "meditated" | "attended";

export type LeaderRhythmStatusItem = {
  key: RhythmKey;
  label: string;
  done: boolean;
};

export type LeaderMemberCareSummary = {
  userId: string;
  displayName: string;
  latestCheckInLabel: string;
  latestMoodLabel: string | null;
  hasTodayCheckIn: boolean;
  rhythmStatus: LeaderRhythmStatusItem[];
  missingRhythmLabels: string[];
  rhythmCompletionLabel: string;
  careReason: string;
  visiblePrayerCount: number;
  isQuiet: boolean;
  priorityRank: number;
  careBadgeLabel: string;
  careBadgeTone: "leaf" | "clay" | "blue";
  copyMessage: string;
  copyPreview: string;
  latestCareThread: LeaderCareThreadPreview | null;
  isWaitingOnMember: boolean;
  daysSinceLeaderContact: number | null;
  hasTextCareSignal: boolean;
  timeline: TimelineDay[];
};

export type LeaderCareBoardData = {
  currentUserId: string;
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
  careMessages: CareMessageWithSender[];
  currentUserId: string;
  memberTimelinesByUser?: Map<string, TimelineDay[]>;
  now?: Date;
};

const rhythmDefinitions: Array<{ key: RhythmKey; label: string }> = [
  { key: "woke_up", label: "기상" },
  { key: "bible_read", label: "말씀" },
  { key: "prayed", label: "기도" },
  { key: "meditated", label: "묵상" },
  { key: "attended", label: "예배/모임" },
];

export function createLeaderCareBoardData(input: LeaderCareBoardInput): LeaderCareBoardData {
  const memberUserIds = new Set(input.members.filter((member) => member.role === "member").map((member) => member.user_id));
  const todayMemberVisibleCheckInCount = input.todayCheckins.filter((checkin) => memberUserIds.has(checkin.user_id)).length;

  return {
    currentUserId: input.currentUserId,
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
      careMessages: input.careMessages,
      currentUserId: input.currentUserId,
      memberTimelinesByUser: input.memberTimelinesByUser,
      now: input.now,
    }),
  };
}

export function buildLeaderInbox({
  careMessages,
  quietMembers,
  todayCheckins,
  prayers,
}: Pick<LeaderCareBoardInput, "careMessages" | "quietMembers" | "todayCheckins" | "prayers">): LeaderInboxItem[] {
  const needPrayerCheckIns = todayCheckins.filter((checkin) => checkin.mood === "hard" || checkin.mood === "need_prayer");
  const unansweredPrayerCount = prayers.filter((prayer) => !prayer.answered_at).length;
  const waitingCareThreadCount = countThreadsWaitingForLeader(careMessages);
  const items: LeaderInboxItem[] = [];

  if (waitingCareThreadCount > 0) {
    items.push({
      id: "care-thread-replies",
      title: "답장을 기다리는 대화",
      body: `${waitingCareThreadCount}개의 돌봄 대화가 리더 답장을 기다리고 있어요.`,
      priorityRank: 0,
      tone: "blue",
    });
  }

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
  careMessages,
  currentUserId,
  memberTimelinesByUser,
  members,
  quietMembers,
  recentCheckIns,
  prayers,
  now = new Date(),
}: {
  careMessages: CareMessageWithSender[];
  currentUserId: string;
  memberTimelinesByUser?: Map<string, TimelineDay[]>;
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
  const prayersByUser = buildPrayersByUser(attributablePrayers);
  const latestCareThreadByOwner = buildLatestCareThreadByOwner(careMessages, currentUserId);
  const today = toDateKey(now);

  return members
    .filter((member) => member.role === "member")
    .map((member) => {
      const latestCheckIn = latestCheckInByUser.get(member.user_id) ?? null;
      const todayCheckIn = latestCheckIn?.checkin_date === today ? latestCheckIn : null;
      const hasTodayCheckIn = todayCheckIn !== null;
      const rhythmStatus = buildRhythmStatus(todayCheckIn);
      const missingRhythmLabels = buildMissingRhythmLabels(rhythmStatus);
      const visiblePrayerCount = visiblePrayerCountByUser.get(member.user_id) ?? 0;
      const isQuiet = quietMemberIds.has(member.user_id);
      const latestCareThread = latestCareThreadByOwner.get(member.user_id) ?? null;
      const contactWaitingStatus = buildContactWaitingStatus(latestCareThread?.messages ?? [], currentUserId, now);
      const hasTextCareSignal = buildMemberTextCareSignal({
        careMessages,
        latestCheckIn,
        memberUserId: member.user_id,
        prayers: prayersByUser.get(member.user_id) ?? [],
      });
      const priorityRank = buildMemberPriorityRank({
        hasTextCareSignal,
        hasTodayCheckIn,
        isWaitingOnMember: contactWaitingStatus.isWaitingOnMember,
        latestCheckIn: todayCheckIn,
        missingRhythmLabels,
        visiblePrayerCount,
      });
      const careBadge = buildCareBadge({
        hasTodayCheckIn,
        latestCheckIn: todayCheckIn,
        missingRhythmLabels,
        visiblePrayerCount,
      });
      const copyMessage = buildMemberReminderMessage({
        displayName: member.profiles.display_name,
        hasTodayCheckIn,
        missingRhythmLabels,
        visiblePrayerCount,
      });

      return {
        userId: member.user_id,
        displayName: member.profiles.display_name,
        latestCheckInLabel: latestCheckIn ? formatLatestCheckIn(latestCheckIn, today) : "아직 리더에게 보이는 안부가 없어요.",
        latestMoodLabel: todayCheckIn ? moodLabel(todayCheckIn.mood) : null,
        hasTodayCheckIn,
        rhythmStatus,
        missingRhythmLabels,
        rhythmCompletionLabel: `${rhythmStatus.filter((item) => item.done).length}/${rhythmStatus.length}개 리듬`,
        careReason: buildCareReason({
          hasTextCareSignal,
          hasTodayCheckIn,
          latestCheckIn: todayCheckIn,
          missingRhythmLabels,
          visiblePrayerCount,
        }),
        visiblePrayerCount,
        isQuiet,
        priorityRank,
        careBadgeLabel: careBadge.label,
        careBadgeTone: careBadge.tone,
        copyMessage,
        copyPreview: copyMessage,
        latestCareThread,
        isWaitingOnMember: contactWaitingStatus.isWaitingOnMember,
        daysSinceLeaderContact: contactWaitingStatus.daysSinceLeaderContact,
        hasTextCareSignal,
        timeline: memberTimelinesByUser?.get(member.user_id) ?? [],
      };
    })
    .sort((left, right) => {
      const priorityCompare = left.priorityRank - right.priorityRank;
      return priorityCompare === 0 ? left.displayName.localeCompare(right.displayName, "ko-KR") : priorityCompare;
    });
}

function buildRhythmStatus(checkin: CheckInWithAuthor | null): LeaderRhythmStatusItem[] {
  return rhythmDefinitions.map((definition) => ({
    ...definition,
    done: Boolean(checkin?.[definition.key]),
  }));
}

function buildMissingRhythmLabels(rhythmStatus: LeaderRhythmStatusItem[]) {
  return rhythmStatus.filter((item) => !item.done).map((item) => item.label);
}

export function buildCopyReadyMessages(displayName: string | null) {
  const name = displayName ? `${displayName}님` : "함께 나눠준 분";

  return {
    gentleCheckIn: `${name}, 이번 주는 어떻게 지내고 있어요? 부담 없이 짧게 나눠줘도 괜찮아요.`,
    gentleResponse: `${name}, 남겨준 안부 함께 기억하고 있어요. 이번 주도 혼자 감당하지 않아도 괜찮아요.`,
    prayerSupport: `${name}, 남겨준 기도제목 함께 기억하고 기도할게요. 말해줘서 고마워요.`,
  };
}

function buildMemberReminderMessage({
  displayName,
  hasTodayCheckIn,
  missingRhythmLabels,
  visiblePrayerCount,
}: {
  displayName: string;
  hasTodayCheckIn: boolean;
  missingRhythmLabels: string[];
  visiblePrayerCount: number;
}) {
  const name = `${displayName}님`;

  if (!hasTodayCheckIn) {
    return `${name}, 오늘 안부를 아직 못 봐서요. 부담 없는 만큼 체크인과 기도제목을 가볍게 남겨줘도 괜찮아요.`;
  }

  if (missingRhythmLabels.length > 0) {
    return `${name}, 오늘 ${formatKoreanList(missingRhythmLabels)} 리듬도 남길 수 있으면 함께 기억할게요. 부담되는 항목은 건너뛰어도 괜찮아요.`;
  }

  if (visiblePrayerCount > 0) {
    return `${name}, 오늘 남겨준 안부와 기도제목 함께 기억하고 있어요. 이번 주도 혼자 감당하지 않아도 괜찮아요.`;
  }

  return `${name}, 오늘 리듬 남겨줘서 고마워요. 계속 편하게 안부를 나눠줘도 괜찮아요.`;
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

function buildPrayersByUser(prayers: PrayerRequestWithAuthor[]) {
  const prayersByUser = new Map<string, PrayerRequestWithAuthor[]>();

  prayers.forEach((prayer) => {
    const list = prayersByUser.get(prayer.user_id) ?? [];
    list.push(prayer);
    prayersByUser.set(prayer.user_id, list);
  });

  return prayersByUser;
}

function buildMemberTextCareSignal({
  careMessages,
  latestCheckIn,
  memberUserId,
  prayers,
}: {
  careMessages: CareMessageWithSender[];
  latestCheckIn: CheckInWithAuthor | null;
  memberUserId: string;
  prayers: PrayerRequestWithAuthor[];
}) {
  return (
    hasCareSignal(latestCheckIn?.note) ||
    prayers.some((prayer) => hasCareSignal(prayer.content)) ||
    careMessages.some((message) => message.thread_owner_id === memberUserId && message.sender_id === memberUserId && hasCareSignal(message.body))
  );
}

function countThreadsWaitingForLeader(messages: CareMessageWithSender[]) {
  return [...buildLatestCareThreadByOwner(messages, "").values()].filter((thread) => thread.waitingForLeaderResponse).length;
}

function buildContactWaitingStatus(
  threadMessages: CareMessageWithSender[],
  currentUserId: string,
  today: Date,
): { isWaitingOnMember: boolean; daysSinceLeaderContact: number | null } {
  if (threadMessages.length === 0) {
    return { isWaitingOnMember: false, daysSinceLeaderContact: null };
  }

  const last = threadMessages[threadMessages.length - 1];
  const leaderSentLast = last.sender_id === currentUserId;

  if (!leaderSentLast) {
    return { isWaitingOnMember: false, daysSinceLeaderContact: null };
  }

  const days = Math.floor((today.getTime() - new Date(last.created_at).getTime()) / 86_400_000);

  return { isWaitingOnMember: days >= 3, daysSinceLeaderContact: days };
}

function buildLatestCareThreadByOwner(messages: CareMessageWithSender[], currentUserId: string) {
  const threadsByParent = new Map<string, CareMessageWithSender[]>();

  messages.forEach((message) => {
    const key = `${message.parent_type}:${message.parent_id}`;
    const threadMessages = threadsByParent.get(key) ?? [];
    threadMessages.push(message);
    threadsByParent.set(key, threadMessages);
  });

  const latestByOwner = new Map<string, LeaderCareThreadPreview>();

  threadsByParent.forEach((threadMessages) => {
    const orderedMessages = [...threadMessages].sort((left, right) => left.created_at.localeCompare(right.created_at));
    const firstMessage = orderedMessages[0];
    const lastMessage = orderedMessages[orderedMessages.length - 1];

    if (!firstMessage || !lastMessage) {
      return;
    }

    const preview: LeaderCareThreadPreview = {
      parentType: firstMessage.parent_type,
      parentId: firstMessage.parent_id,
      groupId: firstMessage.group_id,
      threadOwnerId: firstMessage.thread_owner_id,
      messageCount: orderedMessages.length,
      lastMessageBody: lastMessage.body,
      lastMessageSenderId: lastMessage.sender_id,
      lastMessageSenderName: lastMessage.profiles.display_name,
      lastMessageCreatedAt: lastMessage.created_at,
      waitingForLeaderResponse: lastMessage.sender_id === firstMessage.thread_owner_id && lastMessage.sender_id !== currentUserId,
      messages: orderedMessages,
    };
    const existing = latestByOwner.get(firstMessage.thread_owner_id);

    if (!existing || preview.lastMessageCreatedAt > existing.lastMessageCreatedAt) {
      latestByOwner.set(firstMessage.thread_owner_id, preview);
    }
  });

  return latestByOwner;
}

function buildCareReason({
  hasTextCareSignal,
  hasTodayCheckIn,
  latestCheckIn,
  missingRhythmLabels,
  visiblePrayerCount,
}: {
  hasTextCareSignal: boolean;
  hasTodayCheckIn: boolean;
  latestCheckIn: CheckInWithAuthor | null;
  missingRhythmLabels: string[];
  visiblePrayerCount: number;
}) {
  if (latestCheckIn?.mood === "hard" || latestCheckIn?.mood === "need_prayer") {
    return "오늘 안부를 조금 더 살펴보면 좋아요.";
  }

  if (hasTextCareSignal) {
    return "남긴 글 안에 리더가 조금 더 주의 깊게 읽을 표현이 있어요.";
  }

  if (!hasTodayCheckIn) {
    return "오늘 안부가 아직 보이지 않아요. 부담 없이 남길 수 있게 안내해 주세요.";
  }

  if (missingRhythmLabels.length > 0) {
    return `${formatKoreanList(missingRhythmLabels)} 리듬은 아직 보이지 않아요.`;
  }

  if (visiblePrayerCount > 0) {
    return "함께 기억할 기도제목이 있어요.";
  }

  return "최근 안부가 남겨졌어요.";
}

function buildMemberPriorityRank({
  hasTextCareSignal,
  hasTodayCheckIn,
  isWaitingOnMember,
  latestCheckIn,
  missingRhythmLabels,
  visiblePrayerCount,
}: {
  hasTextCareSignal: boolean;
  hasTodayCheckIn: boolean;
  isWaitingOnMember: boolean;
  latestCheckIn: CheckInWithAuthor | null;
  missingRhythmLabels: string[];
  visiblePrayerCount: number;
}) {
  if (latestCheckIn?.mood === "hard" || latestCheckIn?.mood === "need_prayer" || hasTextCareSignal) {
    return 1;
  }

  if (isWaitingOnMember) {
    return 1.5;
  }

  if (!hasTodayCheckIn) {
    return 2;
  }

  if (visiblePrayerCount > 0) {
    return 3;
  }

  if (missingRhythmLabels.length > 0) {
    return 4;
  }

  return 5;
}

function buildCareBadge({
  hasTodayCheckIn,
  latestCheckIn,
  missingRhythmLabels,
  visiblePrayerCount,
}: {
  hasTodayCheckIn: boolean;
  latestCheckIn: CheckInWithAuthor | null;
  missingRhythmLabels: string[];
  visiblePrayerCount: number;
}) {
  if (latestCheckIn?.mood === "hard" || latestCheckIn?.mood === "need_prayer") {
    return { label: "조금 더 살피기", tone: "blue" as const };
  }

  if (!hasTodayCheckIn) {
    return { label: "오늘 안부 전", tone: "leaf" as const };
  }

  if (visiblePrayerCount > 0) {
    return { label: "기도제목 있음", tone: "clay" as const };
  }

  if (missingRhythmLabels.length > 0) {
    return { label: "리듬 확인 전", tone: "blue" as const };
  }

  return { label: "오늘 리듬 있음", tone: "leaf" as const };
}

function formatKoreanList(labels: string[]) {
  if (labels.length === 0) {
    return "";
  }

  if (labels.length <= 3) {
    return labels.join(", ");
  }

  return `${labels.slice(0, 3).join(", ")} 외 ${labels.length - 3}개`;
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
