import { LeaderCareBoard } from "@/components/leader-care-board";
import type { LeaderDashboardData } from "@/lib/data/leader-dashboard";

type LeaderDashboardViewProps = {
  data: LeaderDashboardData;
};

export function LeaderDashboardView({ data }: LeaderDashboardViewProps) {
  if (!data.activeGroup) {
    return null;
  }

  return (
    <LeaderCareBoard
      activeGroupName={data.activeGroup.name}
      data={data.careBoard}
      inviteCode={data.activeGroup.invite_code}
    />
  );
}
