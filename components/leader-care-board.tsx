import { Bell, CheckCircle2, HeartHandshake, KeyRound, MessageCircle, Moon, UsersRound } from "lucide-react";
import type { ReactNode } from "react";
import { CopyTextButton } from "@/components/copy-text-button";
import type { LeaderCareBoardData } from "@/lib/data/leader-care-board";

type LeaderCareBoardProps = {
  activeGroupName: string;
  inviteCode: string;
  data: LeaderCareBoardData;
};

const toneClassNames: Record<LeaderCareBoardData["inbox"][number]["tone"], string> = {
  leaf: "border-leaf/15 bg-mist text-leaf",
  clay: "border-clay/15 bg-[#FFF5EF] text-clay",
  blue: "border-bluewash bg-bluewash text-leaf",
};

export function LeaderCareBoard({ activeGroupName, inviteCode, data }: LeaderCareBoardProps) {
  return (
    <div className="grid gap-4">
      <section className="rounded-lg bg-leaf p-4 text-white shadow-soft">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/15">
            <HeartHandshake className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white/80">리더 돌봄 보드</p>
            <h2 className="mt-1 text-xl font-bold">오늘 살펴볼 안부</h2>
            <p className="mt-2 text-sm leading-6 text-white/85">
              카톡에 흘러가기 쉬운 체크인과 기도제목을 오늘 돌볼 일로 정리했어요.
            </p>
          </div>
        </div>
        <div className="mt-4 rounded-md bg-white/10 px-3 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white/70">지금 보고 있는 방</p>
              <p className="mt-1 truncate text-sm font-bold text-white">{activeGroupName}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1 rounded-full bg-white px-2 py-1 text-xs font-semibold text-leaf">
              <KeyRound className="h-3.5 w-3.5" />
              {inviteCode}
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-2">
        <SummaryTile label="참여 멤버" value={data.totals.memberCount} />
        <SummaryTile label="오늘 안부" value={data.totals.todayVisibleCheckInCount} />
        <SummaryTile label="기도제목" value={data.totals.visiblePrayerCount} />
        <SummaryTile label="살펴볼 멤버" value={data.totals.quietMemberCount} />
      </section>

      <section className="rounded-lg border border-white/70 bg-white/90 p-4 shadow-soft">
        <SectionHeader
          body="점수나 출석표가 아니라, 오늘 리더가 기억하면 좋은 신호예요."
          icon={<Bell className="h-4 w-4" />}
          title="오늘 살펴볼 안부"
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

      <section className="rounded-lg border border-white/70 bg-white/90 p-4 shadow-soft">
        <SectionHeader
          body="날짜별로 쌓인 제목을 보고, 필요한 경우 가볍게 기도 응원 문구를 복사해요."
          icon={<HeartHandshake className="h-4 w-4" />}
          title="기도제목 타임라인"
        />
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
                        {prayer.alreadyPrayed ? "리더 확인함" : `${prayer.reactionCount}명 기도`}
                      </span>
                    </div>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">{prayer.content}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {prayer.copyMessage && prayer.copyLabel ? (
                        <CopyTextButton text={prayer.copyMessage}>{prayer.copyLabel}</CopyTextButton>
                      ) : (
                        <p className="rounded-md bg-mist px-3 py-2 text-xs leading-5 text-slate-600">
                          익명 제목은 작성자를 표시하지 않아요.
                        </p>
                      )}
                    </div>
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
          body="개별 연락은 앱에서 보내지 않고, 리더가 직접 확인해서 필요한 사람에게만 전해요."
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
                  {member.isQuiet ? (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-mist px-2 py-1 text-xs font-semibold text-leaf">
                      <Moon className="h-3.5 w-3.5" />
                      살펴보기
                    </span>
                  ) : (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-bluewash px-2 py-1 text-xs font-semibold text-leaf">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      안부 있음
                    </span>
                  )}
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-700">{member.careReason}</p>
                {member.visiblePrayerCount > 0 ? (
                  <p className="mt-1 text-xs text-slate-500">
                    리더에게 보이는 기도제목 {member.visiblePrayerCount}개
                  </p>
                ) : null}
                <div className="mt-3">
                  <CopyTextButton text={member.copyMessage}>
                    <span className="inline-flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      안부 문구 복사
                    </span>
                  </CopyTextButton>
                </div>
              </article>
            ))
          ) : (
            <p className="rounded-md bg-mist px-3 py-3 text-sm leading-6 text-slate-600">
              아직 함께하는 멤버가 없어요. 초대코드를 보내 첫 체크인을 받아보세요.
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
