import { redirect } from "next/navigation";
import { ActionMessage } from "@/components/action-message";
import { AppShell } from "@/components/app-shell";
import { AuthPanel, type AuthPanelMessage } from "@/components/auth-panel";
import { CheckInActivityList } from "@/components/check-in-activity-list";
import { CheckInForm } from "@/components/check-in-form";
import { CreateGroupForm } from "@/components/create-group-form";
import { JoinGroupForm } from "@/components/join-group-form";
import { LeaderInviteCard } from "@/components/leader-invite-card";
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
  actionError?: string | string[];
  actionSuccess?: string | string[];
  error?: string | string[];
  inviteCode?: string | string[];
  notice?: string | string[];
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function isFeedbackCodeFor(code: string | undefined, prefix: string) {
  return Boolean(code?.startsWith(prefix));
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

  if (notice === "password-updated") {
    return {
      tone: "success",
      title: "비밀번호를 바꿨어요",
      body: "방금 설정한 새 비밀번호로 다시 로그인해 주세요.",
      suggestedIntent: "signIn",
    };
  }

  if (notice === "reset-email") {
    return {
      tone: "success",
      title: "비밀번호 재설정 메일을 보냈어요",
      body: "메일함에서 재설정 링크를 열고 새 비밀번호를 만든 뒤 다시 로그인해 주세요.",
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
      body: "이미 가입한 이메일이라면 로그인해 주세요. 다른 이메일도 안 된다면 베타 운영자에게 알려주세요.",
      suggestedIntent: "signUp",
    };
  }

  if (error === "signup-config") {
    return {
      tone: "error",
      title: "가입 설정을 확인해야 해요",
      body: "Vercel의 Supabase URL은 /rest/v1 없이 프로젝트 주소만 넣어야 하고, Supabase Auth Redirect URL에 배포 주소의 /auth/callback이 있어야 해요.",
      suggestedIntent: "signUp",
    };
  }

  if (error === "signup-disabled") {
    return {
      tone: "error",
      title: "이메일 가입이 꺼져 있어요",
      body: "Supabase Authentication 설정에서 이메일 가입을 켠 뒤 다시 시도해 주세요.",
      suggestedIntent: "signUp",
    };
  }

  if (error === "signup-rate-limit") {
    return {
      tone: "error",
      title: "가입 메일을 잠시 후 다시 보내야 해요",
      body: "짧은 시간에 가입 메일을 여러 번 보내면 Supabase가 잠시 제한할 수 있어요. 몇 분 뒤 다시 시도해 주세요.",
      suggestedIntent: "signUp",
    };
  }

  if (error === "login") {
    return {
      tone: "error",
      title: "로그인 중 문제가 생겼어요",
      body: "잠시 후 다시 시도해 주세요. 계속 어렵다면 베타 운영자에게 알려주세요.",
      suggestedIntent: "signIn",
    };
  }

  if (error === "login-invalid") {
    return {
      tone: "error",
      title: "이메일 또는 비밀번호가 맞지 않아요",
      body: "비밀번호를 다시 입력해 주세요. 기억나지 않으면 아래에서 재설정 메일을 받을 수 있어요.",
      suggestedIntent: "signIn",
    };
  }

  if (error === "login-rate-limit") {
    return {
      tone: "error",
      title: "로그인 요청이 잠시 제한됐어요",
      body: "짧은 시간에 여러 번 로그인하면 잠시 막힐 수 있어요. 몇 분 뒤 다시 시도해 주세요.",
      suggestedIntent: "signIn",
    };
  }

  if (error === "login-email-unconfirmed") {
    return {
      tone: "error",
      title: "이메일 확인이 아직 필요해요",
      body: "새 계정은 메일함에서 가입 확인 링크를 먼저 눌러야 로그인할 수 있어요. 스팸함도 확인해 주세요.",
      suggestedIntent: "signIn",
    };
  }

  if (error === "reset-invalid") {
    return {
      tone: "error",
      title: "이메일을 확인해 주세요",
      body: "비밀번호 재설정 메일을 받을 이메일 주소를 입력해 주세요.",
      suggestedIntent: "signIn",
    };
  }

  if (error === "reset-config") {
    return {
      tone: "error",
      title: "재설정 링크 설정을 확인해야 해요",
      body: "Supabase Auth Redirect URL에 배포 주소의 /auth/reset-password가 허용되어야 해요.",
      suggestedIntent: "signIn",
    };
  }

  if (error === "reset-rate-limit") {
    return {
      tone: "error",
      title: "비밀번호 재설정 메일 요청이 잠시 제한됐어요",
      body: "짧은 시간에 재설정 메일을 여러 번 요청하면 Supabase가 잠시 제한할 수 있어요. 몇 분 뒤 다시 요청해 주세요.",
      suggestedIntent: "signIn",
    };
  }

  if (error === "reset") {
    return {
      tone: "error",
      title: "재설정 메일을 보내지 못했어요",
      body: "이메일을 확인한 뒤 다시 시도해 주세요. 계속 어렵다면 베타 운영자에게 알려주세요.",
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
        <AuthPanel message={getAuthPanelMessage(params)} />
      </AppShell>
    );
  }

  const dashboard = await getDashboardData(supabase, user.id);

  if (!dashboard.profile) {
    return (
      <AppShell>
        <div className="grid gap-4">
          <ActionMessage errorCode={actionError} successCode={actionSuccess} />
          <ProfileSetupForm email={user.email ?? ""} />
        </div>
      </AppShell>
    );
  }

  if (!dashboard.activeGroup) {
    return (
      <AppShell profileName={dashboard.profile.display_name}>
        <div className="grid gap-4">
          <ActionMessage errorCode={actionError} successCode={actionSuccess} />
          <section className="border-b border-slate-200/70 pb-4">
            <p className="text-sm font-bold text-leaf">동행방을 시작해볼까요?</p>
            <h2 className="mt-1 text-[21px] font-bold leading-tight text-ink">대화는 카톡에서, 안부와 기도제목 기록은 동행방에서.</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              리더는 소그룹 방을 만들고, 멤버는 리더에게 받은 초대코드로 들어오면 돼요.
              공개 범위는 제출 전에 확인할 수 있어요.
            </p>
            <ol className="mt-4 grid gap-2 text-sm leading-6 text-slate-600">
              <li className="rounded-lg border border-slate-200/70 bg-white px-3 py-2">
                <span className="font-bold text-ink">리더라면 방 만들기</span>
                <span> - 소그룹 이름을 넣고 초대코드를 만들어요.</span>
              </li>
              <li className="rounded-lg border border-slate-200/70 bg-white px-3 py-2">
                <span className="font-bold text-ink">멤버라면 초대코드 입력</span>
                <span> - 리더에게 받은 코드로 동행방에 들어가요.</span>
              </li>
            </ol>
          </section>
          <CreateGroupForm />
          <JoinGroupForm defaultInviteCode={firstParam(params.inviteCode)} />
        </div>
      </AppShell>
    );
  }

  if (!dashboard.membership) {
    redirect("/");
  }

  const isCheckInFeedback =
    isFeedbackCodeFor(actionError, "checkin-") || isFeedbackCodeFor(actionSuccess, "checkin-");
  const isPrayerFeedback = isFeedbackCodeFor(actionError, "prayer-") || isFeedbackCodeFor(actionSuccess, "prayer-");
  const shouldShowGlobalActionMessage = !isCheckInFeedback && !isPrayerFeedback;

  return (
    <AppShell
      groupName={dashboard.activeGroup.name}
      profileName={dashboard.profile.display_name}
      role={dashboard.membership.role}
    >
      <div className="grid gap-4">
        {shouldShowGlobalActionMessage ? <ActionMessage errorCode={actionError} successCode={actionSuccess} /> : null}
        <div className="scroll-mt-4 grid gap-3" id="check-in-status">
          <TodayStatus
            checkIn={dashboard.todayCheckIn}
            groupName={dashboard.activeGroup.name}
          />
          {isCheckInFeedback ? <ActionMessage errorCode={actionError} successCode={actionSuccess} /> : null}
        </div>
        <CheckInForm groupId={dashboard.activeGroup.id} todayCheckIn={dashboard.todayCheckIn} />
        <PrayerRequestForm clearDraft={actionSuccess === "prayer-saved"} groupId={dashboard.activeGroup.id} />
        <div className="scroll-mt-4 grid gap-3" id="prayer-cards">
          {isPrayerFeedback ? <ActionMessage errorCode={actionError} successCode={actionSuccess} /> : null}
          <PrayerRequestList
            currentUserId={user.id}
            prayers={dashboard.prayerRequests}
            reactions={dashboard.prayerReactions}
          />
        </div>
        {dashboard.membership.role === "leader" ? (
          <LeaderDashboard
            activeGroupName={dashboard.activeGroup.name}
            currentUserId={user.id}
            quietMembers={dashboard.quietMembers}
            recentCheckIns={dashboard.recentCheckIns}
            prayers={dashboard.prayerRequests}
          />
        ) : null}
        <CheckInActivityList currentUserId={user.id} checkIns={dashboard.recentCheckIns} />
        {dashboard.membership.role === "leader" ? (
          <LeaderInviteCard groupName={dashboard.activeGroup.name} inviteCode={dashboard.activeGroup.invite_code} />
        ) : null}
      </div>
    </AppShell>
  );
}
