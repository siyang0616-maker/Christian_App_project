import { LogOut, ShieldCheck } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";
import { signOut } from "@/lib/actions/auth";
import type { MemberRole } from "@/lib/types";

type AppShellProps = {
  children: React.ReactNode;
  groupName?: string;
  profileName?: string;
  role?: MemberRole;
};

export function AppShell({ children, groupName, profileName, role }: AppShellProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 py-5">
      <header className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-leaf">동행방</p>
          <h1 className="mt-1 text-2xl font-bold tracking-normal text-ink">
            {groupName ?? "오늘의 신앙 리듬"}
          </h1>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            {profileName ? `${profileName}님, 함께 기억할 시간을 남겨요.` : "소그룹의 기도와 안부를 차분히 기록해요."}
          </p>
        </div>
        {profileName ? (
          <form action={signOut}>
            <button
              aria-label="로그아웃"
              className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm"
              title="로그아웃"
              type="submit"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </form>
        ) : null}
      </header>
      {role === "leader" ? (
        <Link className="mb-4 flex items-center gap-2 rounded-md border border-leaf/15 bg-white/75 px-3 py-2 text-sm font-semibold text-leaf" href={"/leader" as Route}>
          <ShieldCheck className="h-4 w-4" />
          리더 돌봄 보기
        </Link>
      ) : null}
      {children}
    </main>
  );
}
