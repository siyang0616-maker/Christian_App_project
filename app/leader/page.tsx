import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { AuthPanel } from "@/components/auth-panel";
import { LeaderDashboardView } from "@/components/leader-dashboard-view";
import { ProfileSetupForm } from "@/components/profile-setup-form";
import { SupabaseSetupNotice } from "@/components/supabase-setup-notice";
import { getLeaderDashboardData } from "@/lib/data/leader-dashboard";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function LeaderPage() {
  if (!hasSupabaseEnv()) {
    return (
      <AppShell>
        <SupabaseSetupNotice />
      </AppShell>
    );
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <AppShell>
        <AuthPanel />
      </AppShell>
    );
  }

  const dashboard = await getLeaderDashboardData(supabase, user.id);

  if (!dashboard.profile) {
    return (
      <AppShell>
        <ProfileSetupForm email={user.email ?? ""} />
      </AppShell>
    );
  }

  if (!dashboard.membership || dashboard.membership.role !== "leader" || !dashboard.activeGroup) {
    redirect("/");
  }

  return (
    <AppShell
      currentPath="/leader"
      groupName={dashboard.activeGroup.name}
      profileName={dashboard.profile.display_name}
      role={dashboard.membership.role}
    >
      <LeaderDashboardView data={dashboard} />
    </AppShell>
  );
}
