import { LogOut, ShieldCheck } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import { signOut } from "@/lib/actions/auth";
import type { MemberRole } from "@/lib/types";
import { AuthRecoveryRouter } from "@/components/auth-recovery-router";
import { ProfileNameEditor } from "@/components/profile-name-editor";

type AppShellProps = {
  children: React.ReactNode;
  currentPath?: string;
  groupName?: string;
  profileName?: string;
  role?: MemberRole;
};

export function AppShell({ children, currentPath = "/", groupName, profileName, role }: AppShellProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pb-8">
      <AuthRecoveryRouter />
      <header className="sticky top-0 z-20 -mx-4 mb-5 flex items-start justify-between gap-3 border-b border-white/60 bg-white/70 px-4 py-4 backdrop-blur-xl">
        <div className="min-w-0 flex-1">
          <p className="inline-flex rounded-full bg-mist px-2 py-1 text-xs font-bold text-leaf">동행방</p>
          <h1 className="mt-2 break-words text-[26px] font-bold leading-tight tracking-normal text-ink [overflow-wrap:anywhere]">
            {groupName ?? "오늘 안부와 기도제목"}
          </h1>
          <p className="mt-1 break-words text-sm leading-6 text-slate-600">
            {profileName ? `${profileName}님, 오늘 안부와 기도제목을 짧게 남겨요.` : "소그룹 안부와 기도제목을 함께 기억해요."}
          </p>
          {profileName ? <ProfileNameEditor currentPath={currentPath} profileName={profileName} /> : null}
        </div>
        {profileName ? (
          <form action={signOut} className="shrink-0">
            <button
              aria-label="로그아웃"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/80 bg-white/90 text-slate-600 shadow-sm backdrop-blur"
              title="로그아웃"
              type="submit"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </form>
        ) : null}
      </header>
      {role === "leader" ? (
        <Link className="mb-4 flex items-center gap-2 rounded-md border border-leaf/10 bg-white/80 px-3 py-2 text-sm font-semibold text-leaf shadow-sm backdrop-blur" href={"/leader" as Route}>
          <ShieldCheck className="h-4 w-4" />
          리더 돌봄 보기
        </Link>
      ) : null}
      {children}
    </main>
  );
}
