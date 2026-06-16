import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { AuthPanel, type AuthPanelMessage } from "@/components/auth-panel";
import { CheckInForm } from "@/components/check-in-form";
import { CreateGroupForm } from "@/components/create-group-form";
import { JoinGroupForm } from "@/components/join-group-form";
import { LeaderDashboard } from "@/components/leader-dashboard";
import { PrayerRequestForm } from "@/components/prayer-request-form";
import { PrayerRequestList } from "@/components/prayer-request-list";
import { ProfileSetupForm } from "@/components/profile-setup-form";
import { SupabaseSetupNotice } from "@/components/supabase-setup-notice";
import { TodayStatus } from "@/components/today-status";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { getDashboardData } from "@/lib/data/dashboard";

type HomeSearchParams = {
  error?: string | string[];
  notice?: string | string[];
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getAuthPanelMessage(params: HomeSearchParams): AuthPanelMessage | undefined {
  const error = firstParam(params.error);
  const notice = firstParam(params.notice);

  if (notice === "check-email") {
    return {
      tone: "success",
      title: "가입 확인 메일을 보냈어요",
      body: "메일함에서 확인을 완료한 뒤 다시 로그인해 주세요.",
      suggestedIntent: "signIn",
    };
  }

  if (error === "invalid") {
    return {
      tone: "error",
      title: "입력 내용을 확인해 주세요",
      body: "이메일 형식과 6자 이상 비밀번호가 필요해요.",
      suggestedIntent: "signUp",
    };
  }

  if (error === "signup") {
    return {
      tone: "error",
      title: "계정을 만들 수 없었어요",
      body: "이미 가입한 이메일이라면 로그인해 주세요. 계속 어렵다면 Supabase Auth 설정을 확인해야 해요.",
      suggestedIntent: "signUp",
    };
  }

  if (error === "login") {
    return {
      tone: "error",
      title: "로그인할 수 없었어요",
      body: "이메일 또는 비밀번호를 확인해 주세요. 처음이라면 새 계정 만들기를 먼저 눌러주세요.",
      suggestedIntent: "signIn",
    };
  }

  return undefined;
}

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<HomeSearchParams>;
}) {
  const params = searchParams ? await searchParams : {};

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
        <AuthPanel message={getAuthPanelMessage(params)} />
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
      <AppShell profileName={dashboard.profile.display_name}>
        <div className="grid gap-4">
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
      groupName={dashboard.activeGroup.name}
      profileName={dashboard.profile.display_name}
      role={dashboard.membership.role}
    >
      <div className="grid gap-4">
        <TodayStatus
          checkIn={dashboard.todayCheckIn}
          groupName={dashboard.activeGroup.name}
          inviteCode={dashboard.activeGroup.invite_code}
        />
        <CheckInForm groupId={dashboard.activeGroup.id} todayCheckIn={dashboard.todayCheckIn} />
        <PrayerRequestForm groupId={dashboard.activeGroup.id} />
        <PrayerRequestList
          currentUserId={user.id}
          prayers={dashboard.prayerRequests}
          reactions={dashboard.prayerReactions}
        />
        {dashboard.membership.role === "leader" ? (
          <LeaderDashboard
            members={dashboard.members}
            quietMembers={dashboard.quietMembers}
            recentCheckIns={dashboard.recentCheckIns}
            prayers={dashboard.prayerRequests}
          />
        ) : null}
      </div>
    </AppShell>
  );
}
