import {
  Bell,
  CheckCircle2,
  ClipboardCheck,
  Heart,
  HeartHandshake,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import type { ReactNode } from "react";
import { ActionMessage } from "@/components/action-message";
import { CareThread } from "@/components/care-thread";
import { CopyTextButton } from "@/components/copy-text-button";
import { MemberTimelineGrid } from "@/components/member-timeline-grid";
import { ShareTextActions } from "@/components/share-text-actions";
import { prayForRequest, saveLeaderPrayerCareMark } from "@/lib/actions/prayers";
import type { LeaderCareBoardData } from "@/lib/data/leader-care-board";

type LeaderCareBoardProps = {
  actionError?: string;
  actionSuccess?: string;
  activeGroupName: string;
  data: LeaderCareBoardData;
};

type Tone = "leaf" | "clay" | "blue" | "ink";

const VISIBLE_MEMBER_SUMMARY_COUNT = 20;
const VISIBLE_PRAYER_DATE_GROUP_COUNT = 4;

const signalToneClassNames: Record<LeaderCareBoardData["inbox"][number]["tone"], string> = {
  leaf: "border-leaf/20 bg-[#F3F8F5] text-leaf",
  clay: "border-clay/20 bg-[#FFF4EC] text-clay",
  blue: "border-[#BBD4E2] bg-[#F2F8FB] text-[#315F7D]",
};

const metricToneClassNames: Record<Tone, { icon: string; value: string; bar: string; soft: string }> = {
  leaf: {
    icon: "bg-leaf text-white",
    value: "text-leaf",
    bar: "bg-leaf",
    soft: "bg-[#F3F8F5]",
  },
  clay: {
    icon: "bg-clay text-white",
    value: "text-clay",
    bar: "bg-clay",
    soft: "bg-[#FFF4EC]",
  },
  blue: {
    icon: "bg-[#407BA7] text-white",
    value: "text-[#315F7D]",
    bar: "bg-[#407BA7]",
    soft: "bg-[#F2F8FB]",
  },
  ink: {
    icon: "bg-ink text-white",
    value: "text-ink",
    bar: "bg-ink",
    soft: "bg-slate-50",
  },
};

const memberBadgeClassNames: Record<LeaderCareBoardData["memberSummaries"][number]["careBadgeTone"], string> = {
  leaf: "border-leaf/20 bg-[#F3F8F5] text-leaf",
  clay: "border-clay/20 bg-[#FFF4EC] text-clay",
  blue: "border-[#BBD4E2] bg-[#F2F8FB] text-[#315F7D]",
};

const contactWaitingBadgeClassName = "border-amber-200 bg-amber-50 text-amber-800";
const textCareSignalBadgeClassName = "border-[#BBD4E2] bg-[#F2F8FB] text-[#315F7D]";

export function LeaderCareBoard({ actionError, actionSuccess, activeGroupName, data }: LeaderCareBoardProps) {
  const visibleMemberSummaries = data.memberSummaries.slice(0, VISIBLE_MEMBER_SUMMARY_COUNT);
  const hiddenMemberSummaries = data.memberSummaries.slice(VISIBLE_MEMBER_SUMMARY_COUNT);
  const visiblePrayerDateGroups = data.prayerDateGroups.slice(0, VISIBLE_PRAYER_DATE_GROUP_COUNT);
  const hiddenPrayerDateGroups = data.prayerDateGroups.slice(VISIBLE_PRAYER_DATE_GROUP_COUNT);

  return (
    <div className="grid gap-4">
      <CareCommandCenter activeGroupName={activeGroupName} data={data} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_390px] xl:items-start">
        <div className="grid gap-4">
          <LeaderPriorityPanel data={data} />
          <PrayerCommandList
            actionError={actionError}
            actionSuccess={actionSuccess}
            hiddenPrayerDateGroups={hiddenPrayerDateGroups}
            visiblePrayerDateGroups={visiblePrayerDateGroups}
          />
        </div>

        <aside className="xl:sticky xl:top-24">
          <MemberCareListPanel
            currentUserId={data.currentUserId}
            hiddenMembers={hiddenMemberSummaries}
            members={visibleMemberSummaries}
          />
        </aside>
      </div>
    </div>
  );
}

function CareCommandCenter({
  activeGroupName,
  data,
}: {
  activeGroupName: string;
  data: LeaderCareBoardData;
}) {
  const totalMembersWithLeader = data.totals.memberCount + 1;
  const careFocusCount = data.totals.quietMemberCount + data.totals.importantPrayerCount + data.totals.ongoingPrayerCount;
  const checkInProgress = getProgress(data.totals.todayMemberVisibleCheckInCount, Math.max(data.totals.memberCount, 1));
  const prayerFocusProgress = getProgress(data.totals.careMarkedPrayerCount, Math.max(data.totals.visiblePrayerCount, 1));

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_310px]">
        <div className="p-4 md:p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <p className="inline-flex items-center gap-2 text-xs font-black text-leaf">
                <Sparkles className="h-4 w-4" />
                리더 돌봄 보드
              </p>
              <h2 className="mt-2 max-w-2xl text-[26px] font-black leading-tight text-ink md:text-[36px]">
                오늘 먼저 볼 사람과 기도제목
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                공개된 안부와 기도제목만 모아, 리더가 연락 전에 현재 리듬과 돌봄 우선순위를 빠르게 확인해요.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-[#FAFAF8] px-3 py-3 md:min-w-[190px]">
              <p className="text-xs font-bold text-slate-500">지금 보고 있는 방</p>
              <p className="mt-1 truncate text-base font-black text-ink">{activeGroupName}</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">리더 포함 {totalMembersWithLeader}명</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-5">
            <CareMetricCard
              caption="리더 제외"
              icon={<UsersRound className="h-4 w-4" />}
              label="참여 멤버"
              tone="ink"
              value={data.totals.memberCount}
            />
            <CareMetricCard
              caption="오늘 멤버가 남긴 안부"
              icon={<CheckCircle2 className="h-4 w-4" />}
              label="오늘 안부"
              progress={checkInProgress}
              tone="leaf"
              value={data.totals.todayMemberVisibleCheckInCount}
            />
            <CareMetricCard
              caption="함께 기억할 카드"
              icon={<HeartHandshake className="h-4 w-4" />}
              label="기도제목"
              progress={prayerFocusProgress}
              tone="clay"
              value={data.totals.visiblePrayerCount}
            />
            <CareMetricCard
              caption="먼저 확인할 표시"
              icon={<Bell className="h-4 w-4" />}
              label="중요"
              tone="blue"
              value={data.totals.importantPrayerCount}
            />
            <CareMetricCard
              caption="계속 붙들 제목"
              icon={<ShieldCheck className="h-4 w-4" />}
              label="계속 기도"
              tone="leaf"
              value={data.totals.ongoingPrayerCount}
            />
          </div>
        </div>

        <div className="border-t border-slate-200 bg-ink p-4 text-white lg:border-l lg:border-t-0 md:p-5">
          <p className="text-xs font-black text-white/65">오늘의 돌봄 큐</p>
          <div className="mt-3 flex items-end justify-between gap-4">
            <div>
              <p className="text-5xl font-black leading-none">{careFocusCount}</p>
              <p className="mt-2 text-sm leading-6 text-white/75">오늘 리더가 먼저 확인할 신호예요.</p>
            </div>
            <div className="grid h-16 w-16 place-items-center rounded-lg border border-white/15 bg-white/10 text-center text-xs font-black">
              CARE
            </div>
          </div>
          <div className="mt-5 grid gap-3">
            <CareMiniBar label="안부 필요" value={data.totals.quietMemberCount} />
            <CareMiniBar label="중요 기도" value={data.totals.importantPrayerCount} />
            <CareMiniBar label="계속 기억" value={data.totals.ongoingPrayerCount} />
          </div>
        </div>
      </div>
    </section>
  );
}

function LeaderPriorityPanel({ data }: { data: LeaderCareBoardData }) {
  return <CareSignalBoard data={data} />;
}

function CareSignalBoard({ data }: { data: LeaderCareBoardData }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(31,41,51,0.055)] md:p-5">
      <SectionHeader
        body="안부가 비어 있거나, 새 기도제목이 있거나, 조금 더 살펴볼 표현이 있는 항목을 먼저 보여줘요."
        icon={<Bell className="h-4 w-4" />}
        title="오늘 우선순위"
      />
      <div className="mt-4 grid gap-2 md:grid-cols-3">
        {data.inbox.map((item, index) => (
          <article className={`rounded-lg border px-3 py-3 ${signalToneClassNames[item.tone]}`} key={item.id}>
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-black">{item.title}</p>
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-white/85 text-xs font-black shadow-sm">
                {index + 1}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-700">{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function PrayerCommandList({
  actionError,
  actionSuccess,
  hiddenPrayerDateGroups,
  visiblePrayerDateGroups,
}: {
  actionError?: string;
  actionSuccess?: string;
  hiddenPrayerDateGroups: LeaderCareBoardData["prayerDateGroups"];
  visiblePrayerDateGroups: LeaderCareBoardData["prayerDateGroups"];
}) {
  return (
    <section
      className="scroll-mt-28 rounded-lg border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(31,41,51,0.055)] md:p-5"
      id="leader-prayer-timeline"
    >
      <SectionHeader
        body="새로 남겨진 제목부터 오래 기억할 제목까지, 날짜별로 다시 기도로 붙들 수 있어요."
        icon={<HeartHandshake className="h-4 w-4" />}
        title="기도제목 타임라인"
      />
      <ActionMessage errorCode={actionError} successCode={actionSuccess} />

      <div className="mt-4 grid gap-4">
        {visiblePrayerDateGroups.length > 0 ? (
          <>
            {visiblePrayerDateGroups.map((group) => (
              <PrayerDateGroup group={group} key={group.dateKey} />
            ))}
            {hiddenPrayerDateGroups.length > 0 ? (
              <details className="rounded-lg border border-slate-200 bg-[#FAFAF8] px-3 py-3">
                <summary className="cursor-pointer rounded-md text-sm font-black text-leaf focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-leaf/30">
                  이전 기도제목 {hiddenPrayerDateGroups.length}묶음 더 보기
                </summary>
                <div className="mt-3 grid gap-4">
                  {hiddenPrayerDateGroups.map((group) => (
                    <PrayerDateGroup group={group} key={group.dateKey} />
                  ))}
                </div>
              </details>
            ) : null}
          </>
        ) : (
          <p className="rounded-lg bg-[#F3F8F5] px-3 py-3 text-sm leading-6 text-slate-600">
            아직 리더에게 보이는 기도제목이 없어요. 멤버가 공개 범위를 선택해 남기면 여기에 쌓입니다.
          </p>
        )}
      </div>
    </section>
  );
}

function PrayerDateGroup({ group }: { group: LeaderCareBoardData["prayerDateGroups"][number] }) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center gap-2">
        <span className="h-px flex-1 bg-slate-200" />
        <p className="text-xs font-black uppercase tracking-normal text-slate-500">{group.label}</p>
        <span className="h-px flex-1 bg-slate-200" />
      </div>
      <div className="grid overflow-hidden rounded-lg border border-slate-200 bg-white">
        {group.prayers.map((prayer) => (
          <PrayerTimelineCard prayer={prayer} key={prayer.id} />
        ))}
      </div>
    </div>
  );
}

function PrayerTimelineCard({
  prayer,
}: {
  prayer: LeaderCareBoardData["prayerDateGroups"][number]["prayers"][number];
}) {
  const prioritySurface = prayer.isImportant
    ? "border-l-clay bg-[#FFFCFA]"
    : prayer.isOngoing
      ? "border-l-leaf bg-[#FCFEFC]"
      : "border-l-slate-200 bg-white";

  return (
    <article className={`border-b border-slate-200 border-l-4 px-3 py-3 last:border-b-0 md:px-4 md:py-4 ${prioritySurface}`}>
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_240px] xl:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-black text-ink">{prayer.authorLabel}</p>
            <StatusChip>{prayer.visibilityLabel} · {prayer.createdLabel}</StatusChip>
            <StatusChip tone="leaf">{prayer.prayerStatusLabel}</StatusChip>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {prayer.careMark ? <StatusChip tone="leaf">{prayer.careScopeLabel}</StatusChip> : null}
            {prayer.isImportant ? <StatusChip tone="clay">중요</StatusChip> : null}
            {prayer.isOngoing ? <StatusChip tone="leaf">계속 기억</StatusChip> : null}
            {!prayer.careMark ? <StatusChip>아직 분류 전</StatusChip> : null}
          </div>

          <p className="mt-3 whitespace-pre-wrap text-[15px] leading-7 text-slate-700">{prayer.content}</p>

          {prayer.copyPreview ? (
            <div className="mt-3 rounded-lg border border-leaf/10 bg-[#F3F8F5] px-3 py-2">
              <p className="text-xs font-black text-leaf">보낼 문장</p>
              <p className="mt-1 text-xs leading-5 text-slate-600">{prayer.copyPreview}</p>
            </div>
          ) : null}
        </div>

        <div className="grid gap-2">
          <form action={prayForRequest}>
            <input name="prayerId" type="hidden" value={prayer.id} />
            <input name="returnTo" type="hidden" value="/leader#leader-prayer-timeline" />
            <button
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-clay/25 bg-[#FFF4EC] px-3 text-sm font-black text-clay transition hover:bg-[#FFEBDD] disabled:opacity-60"
              disabled={prayer.alreadyPrayed}
              type="submit"
            >
              <Heart className={prayer.alreadyPrayed ? "h-4 w-4 fill-current" : "h-4 w-4"} />
              {prayer.alreadyPrayed ? "기도로 기억 중" : "기도로 기억하기"}
            </button>
          </form>
          {prayer.copyMessage && prayer.copyLabel ? (
            <CopyTextButton
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-leaf/20 bg-white px-3 text-sm font-black text-leaf shadow-sm transition hover:bg-mist"
              copiedLabel="복사됐어요"
              text={prayer.copyMessage}
            >
              <ClipboardCheck className="h-4 w-4" />
              {prayer.copyLabel}
            </CopyTextButton>
          ) : (
            <p className="rounded-md bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-500">
              이름 숨김 기도제목은 작성자를 드러내는 문구를 만들지 않아요.
            </p>
          )}
          <PrayerCareControl prayer={prayer} />
        </div>
      </div>
    </article>
  );
}

function PrayerCareControl({
  prayer,
}: {
  prayer: LeaderCareBoardData["prayerDateGroups"][number]["prayers"][number];
}) {
  return (
    <form action={saveLeaderPrayerCareMark} className="rounded-lg border border-slate-200 bg-[#FAFAF8] px-3 py-3">
      <input name="prayerId" type="hidden" value={prayer.id} />
      <input name="returnTo" type="hidden" value="/leader#leader-prayer-timeline" />
      <fieldset aria-label="기도제목 돌봄 표시" className="grid gap-2">
        <legend className="text-xs font-black text-slate-600">리더에게만 보이는 표시</legend>
        <div className="grid grid-cols-2 gap-2">
          <CareControlOption checked={prayer.careScope === "communal"} label="함께 기도" name="careScope" type="radio" value="communal" />
          <CareControlOption checked={prayer.careScope === "personal"} label="개별 돌봄" name="careScope" type="radio" value="personal" />
          <CareControlOption checked={prayer.isImportant} label="중요" name="isImportant" tone="clay" type="checkbox" />
          <CareControlOption checked={prayer.isOngoing} label="계속 기억" name="isOngoing" type="checkbox" />
        </div>
      </fieldset>
      <p className="mt-2 text-xs leading-5 text-slate-500">
        멤버에게는 이 분류가 보이지 않고, 리더가 다음 돌봄을 놓치지 않도록 돕는 표시예요.
      </p>
      <button className="mt-3 h-10 w-full rounded-md bg-leaf px-3 text-sm font-black text-white transition hover:bg-leaf/90" type="submit">
        표시 저장
      </button>
    </form>
  );
}

function CareControlOption({
  checked,
  label,
  name,
  tone = "leaf",
  type,
  value,
}: {
  checked: boolean;
  label: string;
  name: string;
  tone?: "leaf" | "clay";
  type: "checkbox" | "radio";
  value?: string;
}) {
  const checkedClass =
    tone === "clay"
      ? "has-[:checked]:border-clay/40 has-[:checked]:bg-[#FFF4EC] has-[:checked]:text-clay"
      : "has-[:checked]:border-leaf/40 has-[:checked]:bg-[#F3F8F5] has-[:checked]:text-leaf";

  return (
    <label
      className={`flex min-h-10 cursor-pointer items-center gap-2 rounded-md border border-slate-200 bg-white px-2 text-xs font-black text-slate-700 transition ${checkedClass}`}
    >
      <input
        className={tone === "clay" ? "accent-clay" : "accent-leaf"}
        defaultChecked={checked}
        name={name}
        type={type}
        value={value}
      />
      {label}
    </label>
  );
}

function MemberCareListPanel({
  currentUserId,
  hiddenMembers,
  members,
}: {
  currentUserId: string;
  hiddenMembers: LeaderCareBoardData["memberSummaries"];
  members: LeaderCareBoardData["memberSummaries"];
}) {
  return <MemberSnapshotRail currentUserId={currentUserId} hiddenMembers={hiddenMembers} members={members} />;
}

function MemberSnapshotRail({
  currentUserId,
  hiddenMembers,
  members,
}: {
  currentUserId: string;
  hiddenMembers: LeaderCareBoardData["memberSummaries"];
  members: LeaderCareBoardData["memberSummaries"];
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-[0_12px_34px_rgba(31,41,51,0.07)]">
      <SectionHeader
        body="체크인, 말씀, 기도, 묵상, 예배/모임 상태를 연락 전에 확인해요. 앱에서 자동 발송되지는 않아요."
        icon={<MessageCircle className="h-4 w-4" />}
        title="멤버 상태판"
      />
      <div className="mt-4 grid max-h-[calc(100dvh-160px)] gap-2 overflow-y-auto pr-1">
        {members.length > 0 ? (
          <>
            <MemberStatusTable currentUserId={currentUserId} members={members} />
            {hiddenMembers.length > 0 ? (
              <details className="rounded-lg border border-slate-200 bg-[#FAFAF8] px-3 py-3">
                <summary className="cursor-pointer rounded-md text-sm font-black text-leaf focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-leaf/30">
                  나머지 멤버 {hiddenMembers.length}명 더 보기
                </summary>
                <div className="mt-3 grid gap-2">
                  <MemberStatusTable currentUserId={currentUserId} members={hiddenMembers} />
                </div>
              </details>
            ) : null}
          </>
        ) : (
          <p className="rounded-lg bg-[#F3F8F5] px-3 py-3 text-sm leading-6 text-slate-600">
            아직 멤버별 안부가 보이지 않아요. 첫 안부나 기도제목이 남겨지면 여기서 바로 확인할 수 있어요.
          </p>
        )}
      </div>
    </section>
  );
}

function MemberStatusTable({ currentUserId, members }: { currentUserId: string; members: LeaderCareBoardData["memberSummaries"] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="hidden grid-cols-[minmax(120px,1.2fr)_74px_74px_88px_minmax(120px,1fr)] gap-2 border-b border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-black text-slate-500 md:grid">
        <span>멤버</span>
        <span className="text-center">안부</span>
        <span className="text-center">기도</span>
        <span className="text-center">리듬</span>
        <span>돌봄 신호</span>
      </div>
      {members.map((member) => (
        <MemberStatusRow currentUserId={currentUserId} member={member} key={member.userId} />
      ))}
    </div>
  );
}

function MemberStatusRow({ currentUserId, member }: { currentUserId: string; member: LeaderCareBoardData["memberSummaries"][number] }) {
  const checkInDone = member.hasTodayCheckIn;
  const prayerDone = member.visiblePrayerCount > 0;
  const doneCount = member.rhythmStatus.filter((item) => item.done).length;
  const rhythmProgress = getProgress(doneCount, member.rhythmStatus.length);
  const actionSummary =
    checkInDone && member.missingRhythmLabels.length === 0 && prayerDone
      ? "오늘은 격려만 보내도 좋아요"
      : "놓친 리듬을 짧게 안내해요";

  return (
    <details className="group border-b border-slate-200 last:border-b-0">
      <summary className="grid cursor-pointer gap-2 px-3 py-3 transition hover:bg-slate-50 md:grid-cols-[minmax(120px,1.2fr)_74px_74px_88px_minmax(120px,1fr)] md:items-center">
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-2 md:block">
            <p className="truncate text-sm font-black text-ink">{member.displayName}</p>
            <span className="flex shrink-0 flex-wrap justify-end gap-1 md:hidden">
              <MemberCareBadge member={member} />
              <ContactWaitingBadge member={member} />
              <TextCareSignalBadge member={member} />
            </span>
          </div>
          <p className="mt-1 truncate text-xs text-slate-500">{member.latestCheckInLabel}</p>
        </div>

        <MatrixState done={checkInDone} label={checkInDone ? "완료" : "필요"} />
        <MatrixState done={prayerDone} label={prayerDone ? `${member.visiblePrayerCount}개` : "없음"} tone={prayerDone ? "clay" : "muted"} />
        <div className="rounded-md bg-[#FAFAF8] px-2 py-2">
          <div className="flex items-center justify-between gap-2 text-xs font-black text-slate-600">
            <span>{doneCount}/{member.rhythmStatus.length}</span>
            <span>{Math.round(rhythmProgress)}%</span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white">
            <div className="h-full rounded-full bg-leaf" style={{ width: `${rhythmProgress}%` }} />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="hidden shrink-0 flex-wrap gap-1 md:flex">
            <MemberCareBadge member={member} />
            <ContactWaitingBadge member={member} />
            <TextCareSignalBadge member={member} />
          </span>
          <p className="min-w-0 truncate text-xs leading-5 text-slate-600">{member.careReason}</p>
        </div>
      </summary>

      <div className="grid gap-3 bg-[#FAFAF8] px-3 pb-3 md:grid-cols-[1fr_1fr]">
        <div className="rounded-lg border border-slate-200 bg-white px-3 py-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-black text-slate-600">오늘 리듬 상세</p>
            <span className="text-xs font-black text-slate-500">{member.rhythmCompletionLabel}</span>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-1.5">
            {member.rhythmStatus.map((item) => (
              <RhythmSignalPill done={item.done} key={item.key} label={item.label} />
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white px-3 py-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-black text-slate-500">보낼 문장</p>
            <span className="rounded-md bg-slate-50 px-2 py-1 text-[11px] font-black text-slate-500">{actionSummary}</span>
          </div>
          <p className="mt-1 break-words text-xs leading-5 text-slate-600 [overflow-wrap:anywhere]">{member.copyPreview}</p>
          <div className="mt-3">
            <ShareTextActions copyLabel="안부 문구 복사" shareLabel="리마인드 보내기" text={member.copyMessage} />
          </div>
        </div>
        <div className="md:col-span-2">
          <MemberTimelineGrid compact timeline={member.timeline} title="최근 4주 안부 기록" />
        </div>
        {member.latestCareThread ? <LeaderCareThreadPanel currentUserId={currentUserId} member={member} /> : null}
      </div>
    </details>
  );
}

function MemberCareBadge({ member }: { member: LeaderCareBoardData["memberSummaries"][number] }) {
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-1 text-[11px] font-black ${memberBadgeClassNames[member.careBadgeTone]}`}>
      {member.careBadgeLabel}
    </span>
  );
}

function ContactWaitingBadge({ member }: { member: LeaderCareBoardData["memberSummaries"][number] }) {
  if (!member.isWaitingOnMember || member.daysSinceLeaderContact === null) {
    return null;
  }

  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-1 text-[11px] font-black ${contactWaitingBadgeClassName}`}>
      D+{member.daysSinceLeaderContact} 응답 없음
    </span>
  );
}

function TextCareSignalBadge({ member }: { member: LeaderCareBoardData["memberSummaries"][number] }) {
  if (!member.hasTextCareSignal) {
    return null;
  }

  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-1 text-[11px] font-black ${textCareSignalBadgeClassName}`}>
      주의 깊게 읽기
    </span>
  );
}

function LeaderCareThreadPanel({
  currentUserId,
  member,
}: {
  currentUserId: string;
  member: LeaderCareBoardData["memberSummaries"][number];
}) {
  const thread = member.latestCareThread;

  if (!thread) {
    return null;
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-3 md:col-span-2">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-black text-slate-500">대화 스레드</p>
          <p className="mt-1 text-sm font-black text-ink">
            {thread.parentType === "checkin" ? "체크인에서 이어진 대화" : "기도제목에서 이어진 대화"}
          </p>
        </div>
        <span
          className={`rounded-md border px-2 py-1 text-[11px] font-black ${
            thread.waitingForLeaderResponse
              ? "border-[#BBD4E2] bg-[#F2F8FB] text-[#315F7D]"
              : "border-leaf/20 bg-[#F3F8F5] text-leaf"
          }`}
        >
          {thread.waitingForLeaderResponse ? "답장 필요" : "대화 기록 있음"}
        </span>
      </div>
      <p className="mb-3 rounded-lg bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-600">
        최근 메시지: {thread.lastMessageSenderName} · {thread.lastMessageBody}
      </p>
      <CareThread
        currentUserId={currentUserId}
        groupId={thread.groupId}
        messages={thread.messages}
        parentId={thread.parentId}
        parentType={thread.parentType}
        returnTo="/leader"
        threadOwnerId={thread.threadOwnerId}
      />
    </div>
  );
}

function MatrixState({
  done,
  label,
  tone,
}: {
  done: boolean;
  label: string;
  tone?: "clay" | "muted";
}) {
  const className = done
    ? tone === "clay"
      ? "border-clay/20 bg-[#FFF4EC] text-clay"
      : "border-leaf/20 bg-[#F3F8F5] text-leaf"
    : tone === "muted"
      ? "border-slate-200 bg-slate-50 text-slate-400"
      : "border-clay/20 bg-[#FFF4EC] text-clay";

  return (
    <span className={`inline-flex min-h-9 items-center justify-center rounded-md border px-2 text-xs font-black ${className}`}>
      {label}
    </span>
  );
}

function RhythmSignalPill({ done, label }: { done: boolean; label: string }) {
  return (
    <div
      className={`flex min-h-8 items-center justify-between gap-1 rounded-md px-2 py-1 text-[11px] font-black ${
        done ? "bg-[#F3F8F5] text-leaf" : "bg-white text-slate-400"
      }`}
    >
      <span>{label}</span>
      <span>{done ? "남김" : "전"}</span>
    </div>
  );
}

function CareMetricCard({
  caption,
  icon,
  label,
  progress,
  tone,
  value,
}: {
  caption: string;
  icon: ReactNode;
  label: string;
  progress?: number;
  tone: Tone;
  value: number;
}) {
  const toneClasses = metricToneClassNames[tone];

  return (
    <div className={`rounded-lg border border-slate-200 p-3 ${toneClasses.soft}`}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-black text-slate-600">{label}</p>
        <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-md ${toneClasses.icon}`}>{icon}</span>
      </div>
      <p className={`mt-3 text-[30px] font-black leading-none ${toneClasses.value}`}>{value}</p>
      <p className="mt-2 min-h-8 text-xs leading-4 text-slate-500">{caption}</p>
      {typeof progress === "number" ? (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/90">
          <div className={`h-full rounded-full ${toneClasses.bar}`} style={{ width: `${progress}%` }} />
        </div>
      ) : null}
    </div>
  );
}

function CareMiniBar({ label, value }: { label: string; value: number }) {
  const width = Math.min(100, Math.max(8, value * 32));

  return (
    <div className="grid gap-1">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-bold text-white/75">{label}</span>
        <span className="text-xs font-black text-white">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/15">
        <div className="h-full rounded-full bg-white" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

function SectionHeader({
  body,
  icon,
  title,
}: {
  body: string;
  icon: ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-[#F3F8F5] text-leaf">{icon}</div>
      <div className="min-w-0">
        <h3 className="text-base font-black text-ink">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-slate-600">{body}</p>
      </div>
    </div>
  );
}

function StatusChip({ children, tone = "ink" }: { children: ReactNode; tone?: Tone }) {
  const className =
    tone === "leaf"
      ? "border-leaf/15 bg-[#F3F8F5] text-leaf"
      : tone === "clay"
        ? "border-clay/15 bg-[#FFF4EC] text-clay"
        : tone === "blue"
          ? "border-[#BBD4E2] bg-[#F2F8FB] text-[#315F7D]"
          : "border-slate-200 bg-slate-50 text-slate-500";

  return <span className={`rounded-md border px-2.5 py-1 text-xs font-black ${className}`}>{children}</span>;
}

function getProgress(value: number, max: number) {
  if (max <= 0) {
    return 0;
  }

  return Math.min(100, Math.round((value / max) * 100));
}
