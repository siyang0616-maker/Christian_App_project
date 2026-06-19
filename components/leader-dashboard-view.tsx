import { ActionMessage } from "@/components/action-message";
import { LeaderCareBoard } from "@/components/leader-care-board";
import type { LeaderDashboardData } from "@/lib/data/leader-dashboard";

type LeaderDashboardViewProps = {
  actionError?: string;
  actionSuccess?: string;
  data: LeaderDashboardData;
};

export function LeaderDashboardView({ actionError, actionSuccess, data }: LeaderDashboardViewProps) {
  if (!data.activeGroup) {
    return null;
  }

  const isPrayerFeedback = actionError?.startsWith("prayer-") || actionSuccess?.startsWith("prayer-");

  return (
    <div className="grid gap-4">
      {!isPrayerFeedback ? <ActionMessage errorCode={actionError} successCode={actionSuccess} /> : null}
      <LeaderCareBoard
        actionError={isPrayerFeedback ? actionError : undefined}
        actionSuccess={isPrayerFeedback ? actionSuccess : undefined}
        activeGroupName={data.activeGroup.name}
        data={data.careBoard}
      />
    </div>
  );
}
