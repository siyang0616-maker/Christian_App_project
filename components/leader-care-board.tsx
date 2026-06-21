import { Bell, Heart, HeartHandshake, UsersRound } from "lucide-react";
import type { ReactNode } from "react";
import { ActionMessage } from "@/components/action-message";
import { CopyTextButton } from "@/components/copy-text-button";
import { prayForRequest, saveLeaderPrayerCareMark } from "@/lib/actions/prayers";
import type { LeaderCareBoardData } from "@/lib/data/leader-care-board";

type LeaderCareBoardProps = {
  actionError?: string;
  actionSuccess?: string;
  activeGroupName: string;
  data: LeaderCareBoardData;
};

const toneClassNames: Record<LeaderCareBoardData["inbox"][number]["tone"], string> = {
  leaf: "border-leaf/15 bg-[#F5F8F6] text-leaf",
  clay: "border-clay/15 bg-[#FBF4EF] text-clay",
  blue: "border-slate-200 bg-slate-50 text-slate-700",
};

const memberBadgeClassNames: Record<LeaderCareBoardData["memberSummaries"][number]["careBadgeTone"], string> = {
  leaf: "bg-[#F5F8F6] text-leaf",
  clay: "bg-[#FBF4EF] text-clay",
  blue: "bg-slate-50 text-slate-600",
};

const VISIBLE_MEMBER_SUMMARY_COUNT = 4;
const VISIBLE_PRAYER_DATE_GROUP_COUNT = 2;

export function LeaderCareBoard({ actionError, actionSuccess, activeGroupName, data }: LeaderCareBoardProps) {
  const visibleMemberSummaries = data.memberSummaries.slice(0, VISIBLE_MEMBER_SUMMARY_COUNT);
  const hiddenMemberSummaries = data.memberSummaries.slice(VISIBLE_MEMBER_SUMMARY_COUNT);
  const visiblePrayerDateGroups = data.prayerDateGroups.slice(0, VISIBLE_PRAYER_DATE_GROUP_COUNT);
  const hiddenPrayerDateGroups = data.prayerDateGroups.slice(VISIBLE_PRAYER_DATE_GROUP_COUNT);

  return (
    <div className="grid gap-3">
      <section className="border-b border-slate-200/70 pb-4">
        <div className="flex items-start gap-3">
          <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-leaf" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-sm font-bold text-leaf">오늘 먼저 살필 것</p>
            <h2 className="mt-1 text-[21px] font-bold leading-tight text-ink">오늘 연락할 멤버와 함께 기도할 제목</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">공개된 내용만 보여요. 이름 숨김은 그대로 지켜져요.</p>
          </div>
        </div>
        <div className="mt-4 rounded-lg border border-slate-200/70 bg-white px-3 py-3 shadow-[0_1px_2px_rgba(31,41,51,0.04)]">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-500">지금 보고 있는 방</p>
            <p className="mt-1 truncate text-sm font-bold text-ink">{activeGroupName}</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-2">
        <SummaryTile label="오늘 확인할 안부" value={data.totals.todayMemberVisibleCheckInCount} />
        <SummaryTile label="함께 기도할 제목" value={data.totals.visiblePrayerCount} />
        <SummaryTile label="계속 기도할 제목" value={data.totals.ongoingPrayerCount} />
        <SummaryTile label="함께하는 멤버" value={data.totals.memberCount} />
      </section>

      <section className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-[0_1px_2px_rgba(31,41,51,0.04)]" id="leader-care-inbox">
        <SectionHeader
          body="앱에 새로 남겨진 안부와 기도제목 중 오늘 먼저 확인할 내용이에요."
          icon={<Bell className="h-4 w-4" />}
          title="먼저 살필 내용"
        />
        <div className="mt-3 grid gap-2">
          {data.inbox.map((item) => (
            <div className={`rounded-lg border px-3 py-3 ${toneClassNames[item.tone]}`} key={item.id}>
              <p className="text-sm font-bold">{item.title}</p>
              <p className="mt-1 text-sm leading-6 text-slate-700">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200/70 bg-white p-4 shadow-[0_1px_2px_rgba(31,41,51,0.04)]">
        <SectionHeader
          body="카톡이나 문자에 붙여넣기 쉽도록 정리한 리더용 문구예요. 앱 안에서 자동 발송되지는 않아요."
          icon={<UsersRound className="h-4 w-4" />}
          title="멤버에게 보낼 안부 문구"
        />
        <div className="mt-3 grid gap-2">
          {data.memberSummaries.length > 0 ? (
            <>
              {visibleMemberSummaries.map((member) => (
                <MemberCareCopyCard member={member} key={member.userId} />
              ))}
              {hiddenMemberSummaries.length > 0 ? (
                <details className="rounded-lg border border-slate-200/70 bg-[#FAFAF8] px-3 py-3">
                  <summary className="cursor-pointer rounded-md text-sm font-bold text-leaf focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-leaf/30">
                    나머지 멤버 안부 문구 {hiddenMemberSummaries.length}명 보기
                  </summary>
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    먼저 살필 멤버를 위에 두고, 나머지 문구는 필요할 때 펼쳐서 복사해요.
                  </p>
                  <div className="mt-3 grid gap-2">
                    {hiddenMemberSummaries.map((member) => (
                      <MemberCareCopyCard member={member} key={member.userId} />
                    ))}
                  </div>
                </details>
              ) : null}
            </>
          ) : (
            <p className="rounded-lg bg-[#F5F8F6] px-3 py-3 text-sm leading-6 text-slate-600">
              아직 멤버별 안부가 쌓이기 전이에요. 첫 안부나 기도제목이 남겨지면 여기에서 다시 볼 수 있어요.
            </p>
          )}
        </div>
      </section>

      <section className="scroll-mt-28 rounded-xl border border-slate-200/70 bg-white p-4 shadow-[0_1px_2px_rgba(31,41,51,0.04)]" id="leader-prayer-timeline">
        <SectionHeader
          body="새로 남겨진 제목부터 오래 기억할 제목까지, 날짜별로 다시 기도로 붙들 수 있어요."
          icon={<HeartHandshake className="h-4 w-4" />}
          title="함께 기도할 제목"
        />
        <ActionMessage errorCode={actionError} successCode={actionSuccess} />
        <div className="mt-4 grid gap-4">
          {data.prayerDateGroups.length > 0 ? (
            <>
              {visiblePrayerDateGroups.map((group) => (
                <PrayerDateGroup group={group} key={group.dateKey} />
              ))}
              {hiddenPrayerDateGroups.length > 0 ? (
                <details className="rounded-lg border border-slate-200/70 bg-[#FAFAF8] px-3 py-3">
                  <summary className="cursor-pointer rounded-md text-sm font-bold text-leaf focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-leaf/30">
                    이전 기도제목 보기
                  </summary>
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    최근 제목을 먼저 보고, 오래된 제목은 필요할 때 펼쳐서 다시 확인해요.
                  </p>
                  <div className="mt-3 grid gap-4">
                    {hiddenPrayerDateGroups.map((group) => (
                      <PrayerDateGroup group={group} key={group.dateKey} />
                    ))}
                  </div>
                </details>
              ) : null}
            </>
          ) : (
            <p className="rounded-lg bg-[#F5F8F6] px-3 py-3 text-sm leading-6 text-slate-600">
              멤버가 첫 기도제목을 남기면, 리더에게 공개된 제목만 여기에 정리돼요.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function PrayerDateGroup({ group }: { group: LeaderCareBoardData["prayerDateGroups"][number] }) {
  return (
    <div className="grid gap-2">
      <p className="text-xs font-bold uppercase tracking-normal text-slate-500">{group.label}</p>
      {group.prayers.map((prayer) => (
        <PrayerTimelineCard prayer={prayer} key={prayer.id} />
      ))}
    </div>
  );
}

function PrayerTimelineCard({
  prayer,
}: {
  prayer: LeaderCareBoardData["prayerDateGroups"][number]["prayers"][number];
}) {
  return (
    <article className="rounded-lg border border-slate-200/70 bg-white px-3 py-3 shadow-[0_1px_2px_rgba(31,41,51,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-bold text-ink">{prayer.authorLabel}</p>
          <p className="mt-1 text-xs text-slate-500">
            {prayer.visibilityLabel} · {prayer.createdLabel}
          </p>
        </div>
        <span className="shrink-0 rounded-md bg-[#F5F8F6] px-2 py-1 text-xs font-semibold text-leaf">
          {prayer.prayerStatusLabel}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {prayer.careMark ? (
          <span className="rounded-md bg-[#F5F8F6] px-2 py-1 text-xs font-semibold text-leaf">
            {prayer.careScopeLabel}
          </span>
        ) : null}
        {prayer.isImportant ? (
          <span className="rounded-md bg-[#FBF4EF] px-2 py-1 text-xs font-semibold text-clay">먼저 살핌</span>
        ) : null}
        {prayer.isOngoing ? (
          <span className="rounded-md bg-[#F5F8F6] px-2 py-1 text-xs font-semibold text-leaf">계속 기억</span>
        ) : null}
        {!prayer.careMark ? (
          <span className="rounded-md bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-500">아직 분류 전</span>
        ) : null}
      </div>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">{prayer.content}</p>
      {prayer.copyPreview ? (
        <div className="mt-3 rounded-lg bg-[#F5F8F6] px-3 py-2">
          <p className="text-xs font-semibold text-leaf">보낼 문장</p>
          <p className="mt-1 text-xs leading-5 text-slate-600">{prayer.copyPreview}</p>
        </div>
      ) : null}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <form action={prayForRequest}>
          <input name="prayerId" type="hidden" value={prayer.id} />
          <input name="returnTo" type="hidden" value="/leader#leader-prayer-timeline" />
          <button
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-clay/25 bg-[#FFF9F5] px-3 text-sm font-semibold text-clay transition hover:bg-[#FFF3EA] disabled:opacity-60"
            disabled={prayer.alreadyPrayed}
            type="submit"
          >
            <Heart className={prayer.alreadyPrayed ? "h-4 w-4 fill-current" : "h-4 w-4"} />
            {prayer.alreadyPrayed ? "기도로 기억 중" : "기도로 기억하기"}
          </button>
        </form>
        {prayer.copyMessage && prayer.copyLabel ? (
          <CopyTextButton text={prayer.copyMessage}>{prayer.copyLabel}</CopyTextButton>
        ) : (
          <p className="rounded-lg bg-[#F5F8F6] px-3 py-2 text-xs leading-5 text-slate-600">
            이름 숨김 제목은 작성자를 드러내는 문구를 만들지 않아요.
          </p>
        )}
      </div>
      <form action={saveLeaderPrayerCareMark} className="mt-3 rounded-lg border border-slate-200/70 bg-[#FAFAF8] px-3 py-3">
        <input name="prayerId" type="hidden" value={prayer.id} />
        <input name="returnTo" type="hidden" value="/leader#leader-prayer-timeline" />
        <p className="text-xs font-bold text-slate-600">돌봄 메모</p>
        <div className="mt-2 grid grid-cols-1 gap-2 min-[380px]:grid-cols-2">
          <label className="flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700">
            <input
              className="accent-leaf"
              defaultChecked={prayer.careScope === "communal"}
              name="careScope"
              type="radio"
              value="communal"
            />
            함께 기도
          </label>
          <label className="flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700">
            <input
              className="accent-leaf"
              defaultChecked={prayer.careScope === "personal"}
              name="careScope"
              type="radio"
              value="personal"
            />
            개별 돌봄
          </label>
          <label className="flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700">
            <input className="accent-leaf" defaultChecked={prayer.isImportant} name="isImportant" type="checkbox" />
            중요
          </label>
          <label className="flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700">
            <input className="accent-leaf" defaultChecked={prayer.isOngoing} name="isOngoing" type="checkbox" />
            계속 기억
          </label>
        </div>
        <p className="mt-2 text-xs leading-5 text-slate-500">
          멤버에게는 이 분류가 보이지 않고, 리더가 다음 돌봄을 놓치지 않도록 돕는 표시예요.
        </p>
        <button className="mt-3 h-10 w-full rounded-lg bg-leaf px-3 text-sm font-bold text-white transition hover:bg-leaf/90" type="submit">
          기억 표시 저장
        </button>
      </form>
    </article>
  );
}

function MemberCareCopyCard({ member }: { member: LeaderCareBoardData["memberSummaries"][number] }) {
  return (
    <article className="rounded-lg border border-slate-200/70 bg-white px-3 py-3 shadow-[0_1px_2px_rgba(31,41,51,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-leaf">{member.displayName}님에게 보낼 문장</p>
          <p className="mt-1 text-sm font-bold text-ink">{member.displayName}</p>
          <p className="mt-1 text-xs text-slate-500">{member.latestCheckInLabel}</p>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold ${memberBadgeClassNames[member.careBadgeTone]}`}
        >
          {member.careBadgeLabel}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-700">{member.careReason}</p>
      {member.visiblePrayerCount > 0 ? (
        <p className="mt-1 text-xs text-slate-500">리더에게 보이는 기도제목 {member.visiblePrayerCount}개</p>
      ) : null}
      <div className="mt-3 rounded-lg border border-slate-200/70 bg-[#FAFAF8] px-3 py-2">
        <p className="text-xs font-semibold text-slate-500">보낼 문장</p>
        <p className="mt-1 break-words text-xs leading-5 text-slate-600 [overflow-wrap:anywhere]">{member.copyPreview}</p>
      </div>
      <div className="mt-3">
        <CopyTextButton
          className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-leaf px-3 text-sm font-bold text-white shadow-sm transition hover:bg-leaf/90"
          text={member.copyMessage}
        >
          <span className="inline-flex items-center gap-2">
            <HeartHandshake className="h-4 w-4" />
            안부 문구 복사
          </span>
        </CopyTextButton>
      </div>
      <p className="mt-2 text-xs leading-5 text-slate-500">복사한 뒤 카톡이나 문자에서 직접 상대를 선택해 보내세요.</p>
    </article>
  );
}

function SummaryTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200/70 bg-white p-3 shadow-[0_1px_2px_rgba(31,41,51,0.04)]">
      <p className="text-xs font-semibold text-slate-600">{label}</p>
      <p className="mt-2 text-[22px] font-bold leading-none text-ink">{value}</p>
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
    <div className="flex items-start gap-2">
      <div className="mt-0.5 shrink-0 text-leaf">{icon}</div>
      <div>
        <h3 className="text-[15px] font-bold text-ink">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-slate-600">{body}</p>
      </div>
    </div>
  );
}
