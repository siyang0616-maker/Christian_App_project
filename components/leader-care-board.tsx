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
  leaf: "border-leaf/15 bg-mist text-leaf",
  clay: "border-clay/15 bg-[#FFF5EF] text-clay",
  blue: "border-bluewash bg-bluewash text-leaf",
};

const memberBadgeClassNames: Record<LeaderCareBoardData["memberSummaries"][number]["careBadgeTone"], string> = {
  leaf: "bg-mist text-leaf",
  clay: "bg-[#FFF5EF] text-clay",
  blue: "bg-bluewash text-leaf",
};

export function LeaderCareBoard({ actionError, actionSuccess, activeGroupName, data }: LeaderCareBoardProps) {
  return (
    <div className="grid gap-4">
      <section className="rounded-lg bg-leaf p-4 text-white shadow-soft">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/15">
            <HeartHandshake className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white/80">리더 돌봄 보드</p>
            <h2 className="mt-1 text-xl font-bold">오늘 함께 기억할 안부</h2>
            <p className="mt-2 text-sm leading-6 text-white/85">
              앱에 새로 남겨진 안부와 기도제목을 리더가 다시 볼 수 있게 정리했어요.
            </p>
          </div>
        </div>
        <div className="mt-4 rounded-md bg-white/10 px-3 py-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white/70">지금 보고 있는 방</p>
            <p className="mt-1 truncate text-sm font-bold text-white">{activeGroupName}</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-2">
        <SummaryTile label="오늘 새 안부" value={data.totals.todayMemberVisibleCheckInCount} />
        <SummaryTile label="보이는 기도제목" value={data.totals.visiblePrayerCount} />
        <SummaryTile label="계속 기억할 제목" value={data.totals.ongoingPrayerCount} />
        <SummaryTile label="함께하는 멤버" value={data.totals.memberCount} />
      </section>

      <section className="rounded-lg border border-white/70 bg-white/90 p-4 shadow-soft" id="leader-care-inbox">
        <SectionHeader
          body="앱에 새로 남겨진 안부와 기도제목 중 오늘 먼저 따뜻하게 기억할 내용이에요."
          icon={<Bell className="h-4 w-4" />}
          title="먼저 기억할 일"
        />
        <div className="mt-3 grid gap-2">
          {data.inbox.map((item) => (
            <div className={`rounded-md border px-3 py-3 ${toneClassNames[item.tone]}`} key={item.id}>
              <p className="text-sm font-bold">{item.title}</p>
              <p className="mt-1 text-sm leading-6 text-slate-700">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="scroll-mt-4 rounded-lg border border-white/70 bg-white/90 p-4 shadow-soft" id="leader-prayer-timeline">
        <SectionHeader
          body="새로 남겨진 제목부터 오래 기억할 제목까지, 날짜별로 다시 기도로 붙들 수 있어요."
          icon={<HeartHandshake className="h-4 w-4" />}
          title="기도제목 타임라인"
        />
        <ActionMessage errorCode={actionError} successCode={actionSuccess} />
        <div className="mt-4 grid gap-4">
          {data.prayerDateGroups.length > 0 ? (
            data.prayerDateGroups.map((group) => (
              <div className="grid gap-2" key={group.dateKey}>
                <p className="text-xs font-bold uppercase tracking-normal text-slate-500">{group.label}</p>
                {group.prayers.map((prayer) => (
                  <article className="rounded-md border border-slate-100 bg-white px-3 py-3" key={prayer.id}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-ink">{prayer.authorLabel}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {prayer.visibilityLabel} · {prayer.createdLabel}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-mist px-2 py-1 text-xs font-semibold text-leaf">
                        {prayer.prayerStatusLabel}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {prayer.careMark ? (
                        <span className="rounded-full bg-bluewash px-2 py-1 text-xs font-semibold text-leaf">
                          {prayer.careScopeLabel}
                        </span>
                      ) : null}
                      {prayer.isImportant ? (
                        <span className="rounded-full bg-[#FFF5EF] px-2 py-1 text-xs font-semibold text-clay">중요</span>
                      ) : null}
                      {prayer.isOngoing ? (
                        <span className="rounded-full bg-mist px-2 py-1 text-xs font-semibold text-leaf">계속 기억</span>
                      ) : null}
                      {!prayer.careMark ? (
                        <span className="rounded-full bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-500">분류 전</span>
                      ) : null}
                    </div>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">{prayer.content}</p>
                    {prayer.copyPreview ? (
                      <div className="mt-3 rounded-md bg-mist px-3 py-2">
                        <p className="text-xs font-semibold text-leaf">복사될 문구</p>
                        <p className="mt-1 text-xs leading-5 text-slate-600">{prayer.copyPreview}</p>
                      </div>
                    ) : null}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <form action={prayForRequest}>
                        <input name="prayerId" type="hidden" value={prayer.id} />
                        <input name="returnTo" type="hidden" value="/leader#leader-prayer-timeline" />
                        <button
                          className="inline-flex h-10 items-center gap-2 rounded-md border border-clay/25 bg-[#FFF9F5] px-3 text-sm font-semibold text-clay disabled:opacity-60"
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
                        <p className="rounded-md bg-mist px-3 py-2 text-xs leading-5 text-slate-600">
                          이름 숨김 제목은 작성자를 드러내는 문구를 만들지 않아요.
                        </p>
                      )}
                    </div>
                    <form action={saveLeaderPrayerCareMark} className="mt-3 rounded-md border border-slate-100 bg-slate-50 px-3 py-3">
                      <input name="prayerId" type="hidden" value={prayer.id} />
                      <input name="returnTo" type="hidden" value="/leader#leader-prayer-timeline" />
                      <p className="text-xs font-bold text-slate-600">리더만 보는 기억 표시</p>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <label className="flex min-h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700">
                          <input
                            className="accent-leaf"
                            defaultChecked={prayer.careScope === "communal"}
                            name="careScope"
                            type="radio"
                            value="communal"
                          />
                          함께 기도
                        </label>
                        <label className="flex min-h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700">
                          <input
                            className="accent-leaf"
                            defaultChecked={prayer.careScope === "personal"}
                            name="careScope"
                            type="radio"
                            value="personal"
                          />
                          개별 돌봄
                        </label>
                        <label className="flex min-h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700">
                          <input className="accent-leaf" defaultChecked={prayer.isImportant} name="isImportant" type="checkbox" />
                          중요
                        </label>
                        <label className="flex min-h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700">
                          <input className="accent-leaf" defaultChecked={prayer.isOngoing} name="isOngoing" type="checkbox" />
                          계속 기억
                        </label>
                      </div>
                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        멤버에게는 이 분류가 보이지 않고, 리더가 다음 돌봄을 놓치지 않도록 돕는 표시예요.
                      </p>
                      <button className="mt-3 h-10 w-full rounded-md bg-leaf px-3 text-sm font-bold text-white" type="submit">
                        기억 표시 저장
                      </button>
                    </form>
                  </article>
                ))}
              </div>
            ))
          ) : (
            <p className="rounded-md bg-mist px-3 py-3 text-sm leading-6 text-slate-600">
              함께 기억할 새 기도제목을 기다리고 있어요.
            </p>
          )}
        </div>
      </section>

      <section className="rounded-lg border border-white/70 bg-white/90 p-4 shadow-soft">
        <SectionHeader
          body="앱에 남겨진 안부와 기도제목만 모아, 이번 주 누구를 부드럽게 기억할지 정리해요."
          icon={<UsersRound className="h-4 w-4" />}
          title="멤버별 안부 스냅샷"
        />
        <div className="mt-3 grid gap-2">
          {data.memberSummaries.length > 0 ? (
            data.memberSummaries.map((member) => (
              <article className="rounded-md border border-slate-100 bg-white px-3 py-3" key={member.userId}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-ink">{member.displayName}</p>
                    <p className="mt-1 text-xs text-slate-500">{member.latestCheckInLabel}</p>
                  </div>
                  <span
                    className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${memberBadgeClassNames[member.careBadgeTone]}`}
                  >
                    {member.careBadgeLabel}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-700">{member.careReason}</p>
                {member.visiblePrayerCount > 0 ? (
                  <p className="mt-1 text-xs text-slate-500">
                    리더에게 보이는 기도제목 {member.visiblePrayerCount}개
                  </p>
                ) : null}
                <div className="mt-3 rounded-md bg-mist px-3 py-2">
                  <p className="text-xs font-semibold text-leaf">복사될 문구</p>
                  <p className="mt-1 text-xs leading-5 text-slate-600">{member.copyPreview}</p>
                </div>
                <div className="mt-3">
                  <CopyTextButton text={member.copyMessage}>
                    <span className="inline-flex items-center gap-2">
                      <HeartHandshake className="h-4 w-4" />
                      안부 문구 복사
                    </span>
                  </CopyTextButton>
                </div>
              </article>
            ))
          ) : (
            <p className="rounded-md bg-mist px-3 py-3 text-sm leading-6 text-slate-600">
              아직 멤버별 안부가 쌓이기 전이에요. 첫 안부나 기도제목이 남겨지면 여기에서 다시 볼 수 있어요.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function SummaryTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-white/70 bg-white/90 p-3 shadow-soft">
      <p className="text-xs font-semibold text-slate-600">{label}</p>
      <p className="mt-2 text-2xl font-bold text-ink">{value}</p>
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
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-mist text-leaf">{icon}</div>
      <div>
        <h3 className="font-bold text-ink">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-slate-600">{body}</p>
      </div>
    </div>
  );
}
