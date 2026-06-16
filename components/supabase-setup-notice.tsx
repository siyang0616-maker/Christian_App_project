import { Database } from "lucide-react";

export function SupabaseSetupNotice() {
  return (
    <section className="rounded-lg border border-white/70 bg-white/90 p-5 shadow-soft">
      <div className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-bluewash text-leaf">
        <Database className="h-6 w-6" />
      </div>
      <h2 className="text-xl font-bold text-ink">Supabase 연결이 필요해요</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        `.env.example`을 `.env.local`로 복사한 뒤 Supabase URL과 anon key를 입력하면 동행방을 사용할 수 있어요.
      </p>
      <div className="mt-4 rounded-md bg-mist px-3 py-2 text-sm font-semibold text-leaf">
        Supabase SQL editor에서 `supabase/migrations` 안의 SQL 파일을 파일명 순서대로 적용해 주세요.
      </div>
    </section>
  );
}
