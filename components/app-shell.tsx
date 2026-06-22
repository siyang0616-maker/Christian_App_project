import { CalendarCheck, LogOut, ShieldCheck } from "lucide-react";
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
  const isLeaderDashboard = currentPath === "/leader" && role === "leader";
  const shellClassName = [
    "mx-auto flex min-h-dvh w-full flex-col pb-10",
    isLeaderDashboard ? "max-w-[1120px] px-4 md:px-6 lg:px-8" : "max-w-[430px] px-4 sm:px-5",
  ].join(" ");
  const edgeClassName = isLeaderDashboard ? "-mx-4 px-4 md:-mx-6 md:px-6 lg:-mx-8 lg:px-8" : "-mx-4 px-4 sm:-mx-5 sm:px-5";

  return (
    <main className={shellClassName}>
      <AuthRecoveryRouter />
      <header
        className={[
          "sticky top-0 z-20 mb-4 flex items-start justify-between gap-3 border-b border-linen/80 bg-[#F8F7F3]/95 py-3 shadow-[0_10px_28px_rgba(31,41,51,0.05)] backdrop-blur",
          edgeClassName,
        ].join(" ")}
      >
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold leading-none text-leaf">동행방</p>
          <h1 className="mt-2 break-words text-[22px] font-bold leading-tight tracking-normal text-ink [overflow-wrap:anywhere]">
            {groupName ?? "오늘 안부와 기도제목"}
          </h1>
          <p className="mt-1 break-words text-[13px] leading-5 text-slate-600">
            {profileName ? `${profileName}님, 오늘 안부를 남기고 함께 기도해요.` : "오늘 안부를 남기고, 함께 기도해요."}
          </p>
          {profileName ? <ProfileNameEditor currentPath={currentPath} profileName={profileName} /> : null}
        </div>
        {profileName ? (
          <form action={signOut} className="shrink-0">
            <button
              aria-label="로그아웃"
              className="grid h-10 w-10 place-items-center rounded-full border border-slate-200/80 bg-white/90 text-slate-600 shadow-sm"
              title="로그아웃"
              type="submit"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </form>
        ) : null}
      </header>
      {role === "leader" ? (
        <nav className="mb-4 grid grid-cols-2 gap-2 rounded-2xl border border-slate-200/70 bg-white/80 p-1.5 shadow-sm backdrop-blur">
          <Link
            className={[
              "flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 text-sm font-bold transition",
              currentPath === "/" ? "bg-leaf text-white shadow-sm" : "text-slate-600 hover:bg-[#F5F8F6] hover:text-leaf",
            ].join(" ")}
            href={"/" as Route}
          >
            <CalendarCheck className="h-4 w-4" />
            오늘 기록
          </Link>
          <Link
            className={[
              "flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 text-sm font-bold transition",
              currentPath === "/leader" ? "bg-leaf text-white shadow-sm" : "text-slate-600 hover:bg-[#F5F8F6] hover:text-leaf",
            ].join(" ")}
            href={"/leader" as Route}
          >
            <ShieldCheck className="h-4 w-4" />
            리더 보드
          </Link>
        </nav>
      ) : null}
      {children}
    </main>
  );
}
