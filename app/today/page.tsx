import { redirect } from "next/navigation";
import { CalendarHeart } from "lucide-react";
import { ActionMessage } from "@/components/action-message";
import { AppShell } from "@/components/app-shell";
import { AuthPanel } from "@/components/auth-panel";
import { CheckInForm } from "@/components/check-in-form";
import { CreateGroupForm } from "@/components/create-group-form";
import { JoinGroupForm } from "@/components/join-group-form";
import { ProfileSetupForm } from "@/components/profile-setup-form";
import { SupabaseSetupNotice } from "@/components/supabase-setup-notice";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { getDashboardData } from "@/lib/data/dashboard";

type TodaySearchParams = {
  actionError?: string | string[];
  actionSuccess?: string | string[];
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function TodayPage({
  searchParams,
}: {
  searchParams?: Promise<TodaySearchParams>;
}) {
  const params = searchParams ? await searchParams : {};
  const actionError = firstParam(params.actionError);
  const actionSuccess = firstParam(params.actionSuccess);

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

  const dashboard = await getDashboardData(supabase, user.id);

  if (!dashboard.profile) {
    return (
      <AppShell>
        <ProfileSetupForm email={user.email ?? ""} />
      </AppShell>
    );
  }

  if (!dashboard.activeGroup) {
    return (
      <AppShell currentPath="/today" profileName={dashboard.profile.display_name}>
        <div className="grid gap-4">
          <ActionMessage errorCode={actionError} successCode={actionSuccess} />
          <CreateGroupForm />
          <JoinGroupForm />
        </div>
      </AppShell>
    );
  }

  if (!dashboard.membership) {
    redirect("/");
  }

  return (
    <AppShell
      currentPath="/today"
      groupName={dashboard.activeGroup.name}
      profileName={dashboard.profile.display_name}
      role={dashboard.membership.role}
    >
      <div className="grid gap-4">
        <section className="rounded-lg bg-leaf p-4 text-white shadow-soft">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/15">
              <CalendarHeart className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white/80">20초 체크인</p>
              <h2 className="mt-1 text-xl font-bold">오늘의 신앙 리듬을 남겨보세요</h2>
              <p className="mt-2 text-sm leading-6 text-white/85">
                누군가를 평가하기 위한 기록이 아니라, 함께 기억하기 위한 오늘의 안부예요.
              </p>
            </div>
          </div>
        </section>
        <div className="scroll-mt-4 grid gap-4" id="check-in-status">
          <ActionMessage errorCode={actionError} successCode={actionSuccess} />
          <CheckInForm
            groupId={dashboard.activeGroup.id}
            returnTo="/today#check-in-status"
            todayCheckIn={dashboard.todayCheckIn}
          />
        </div>
      </div>
    </AppShell>
  );
}
