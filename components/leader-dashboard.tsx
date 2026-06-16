import { ClipboardList, Moon, UsersRound } from "lucide-react";
import type { CheckInWithAuthor, GroupMemberWithProfile, PrayerRequestWithAuthor } from "@/lib/types";
import { formatDateLabel, moodLabel } from "@/lib/ui/labels";

type LeaderDashboardProps = {
  members: GroupMemberWithProfile[];
  quietMembers: GroupMemberWithProfile[];
  recentCheckIns: CheckInWithAuthor[];
  prayers: PrayerRequestWithAuthor[];
};

export function LeaderDashboard({ members, quietMembers, recentCheckIns, prayers }: LeaderDashboardProps) {
  return (
    <section className="rounded-lg border border-leaf/15 bg-white/90 p-4 shadow-soft">
      <div className="mb-4 flex items-center gap-2">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-mist text-leaf">
          <ClipboardList className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-bold text-ink">리더 돌봄 보드</h2>
          <p className="text-sm text-slate-600">멤버의 안부와 기도제목을 먼저 살펴봐요.</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-md bg-mist p-3">
          <p className="text-xs font-semibold text-leaf">함께하는 멤버</p>
          <p className="mt-1 text-2xl font-bold text-ink">{members.length}</p>
        </div>
        <div className="rounded-md bg-[#F7ECE5] p-3">
          <p className="text-xs font-semibold text-clay">기도로 기억할 제목</p>
          <p className="mt-1 text-2xl font-bold text-ink">{prayers.length}</p>
        </div>
      </div>
      <div className="mt-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-bold text-ink">
          <Moon className="h-4 w-4 text-leaf" />
          안부를 살펴볼 멤버
        </div>
        {quietMembers.length > 0 ? (
          <div className="grid gap-2">
            {quietMembers.map((member) => (
              <div className="rounded-md border border-slate-100 bg-white px-3 py-2 text-sm text-slate-700" key={member.user_id}>
                {member.profiles.display_name}
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-md border border-slate-100 bg-white px-3 py-2 text-sm text-slate-600">
            오늘은 안부를 더 살펴볼 멤버가 없어요.
          </p>
        )}
      </div>
      <div className="mt-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-bold text-ink">
          <UsersRound className="h-4 w-4 text-leaf" />
          최근 체크인
        </div>
        <div className="grid gap-2">
          {recentCheckIns.length > 0 ? (
            recentCheckIns.slice(0, 4).map((checkIn) => (
              <div className="rounded-md border border-slate-100 bg-white px-3 py-2" key={checkIn.id}>
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="font-semibold text-ink">{checkIn.profiles.display_name}</span>
                  <span className="text-xs text-slate-500">{formatDateLabel(checkIn.checkin_date)}</span>
                </div>
                <p className="mt-1 text-sm text-slate-600">{moodLabel(checkIn.mood)}</p>
              </div>
            ))
          ) : (
            <p className="rounded-md border border-slate-100 bg-white px-3 py-2 text-sm text-slate-600">
              아직 최근 체크인이 없어요.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
