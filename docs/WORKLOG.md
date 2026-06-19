# Worklog

## 2026-06-19

- User testing feedback showed that the Leader Care Board still did not feel differentiated enough from KakaoTalk because leaders could not classify prayer requests for weekly care.
- Ran product/UX/security sub-agent review for leader prayer care classification.
- Decision: do not overload `prayer_reactions`; create leader-only care marks with RLS.
- Added decision record `superpowers/decisions/2026-06-19-leader-prayer-care-marks.md`.
- Added implementation ticket `superpowers/tickets/2026-06-19-leader-prayer-care-marks.md`.
- Added `supabase/migrations/004_leader_prayer_care_marks.sql` and `docs/SUPABASE_LEADER_PRAYER_CARE_MARKS_SQL.md`.
- Implemented leader-only prayer care marks on `/leader`:
  - `함께 기도`
  - `개별 돌봄`
  - `중요`
  - `계속 기억`
- Added local prayer-timeline action feedback so leader clicks do not feel silent.
- Verified `corepack pnpm verify` passes after the leader prayer care mark implementation.
- Ran sub-agent review for Leader Care Board v1.1 / v1.5 scope:
  - Product/Retention: build no-schema board sharpening now; defer schema work until beta evidence.
  - UX: soften count labels, prioritize care cues, show copy previews, avoid surveillance language.
  - Security/Privacy: defer birthdays, RSVP, stored care status, notification inbox, and contact directory until DB/RLS is designed.
  - Developer/QA: add regression guards, revalidate `/leader`, and use existing `prayer_reactions` for the smallest v1.5.
- Added decision record `superpowers/decisions/2026-06-19-leader-care-board-no-schema-upgrade.md`.
- Added implementation ticket `superpowers/tickets/2026-06-19-leader-care-board-no-schema-upgrade.md`.
- Upgraded Leader Care Board without a schema change:
  - added care-priority sorting
  - added member-focused today check-in count
  - softened summary labels and badges
  - added copy-ready message previews
  - let leaders mark a visible prayer as remembered from `/leader`
  - added action feedback support on `/leader`
  - revalidated `/leader` after check-in, prayer, prayer reaction, create-group, and join-group actions
- Strengthened `scripts/check-leader-care-board-regression.mjs` for the v1.1 / no-schema v1.5 behavior.
- Built Leader Care Board v1 for `/leader` from existing RLS-visible data only.
- Added `lib/data/leader-care-board.ts` with server-side derived care data:
  - today care inbox
  - date-grouped prayer timeline
  - member care summaries
  - manual copy-ready care messages
- Added `components/leader-care-board.tsx` and `components/copy-text-button.tsx`.
- Reduced the home leader dashboard to a warm summary plus `/leader` CTA so the home screen does not feel like a surveillance dashboard.
- Fixed Korean UI labels in `lib/ui/labels.ts`.
- Added `scripts/check-leader-care-board-regression.mjs` and wired it into `scripts/verify.mjs`.
- Sub-agent QA flagged that "공개 기도제목" overclaimed visibility; changed copy to "리더에게 보이는 기도제목."
- Tightened anonymous-prayer privacy posture by avoiding profile lookup for anonymous prayer authors in the leader dashboard profile ID list.
- Verified `corepack pnpm verify` passes after Leader Care Board v1.
- Still deferred: real chat, schedule/RSVP, push/SMS/Kakao notifications, birthdays, contact directory, and attendance scoring.
- Confirmed current Supabase Auth behavior with the public anon key: fresh signup succeeds, but no session is returned and immediate login fails with `email_not_confirmed`.
- Added `scripts/create-confirmed-test-users.mjs` to create fresh confirmed leader/member test users with Supabase Auth Admin API when `SUPABASE_SERVICE_ROLE_KEY` is provided as a server-only shell env var.
- Added `scripts/create-confirmed-test-users.ps1` so Windows can prompt for the service role key without echoing it or storing it in `.env.local`.
- Added `scripts/check-test-user-helper-regression.mjs` and wired it into `scripts/verify.mjs`.
- Verified auth/password/action/test-user helper regression checks pass.
- Verified `corepack pnpm typecheck` passes.
- Verified `eslint .` passes.
- Restarted the local dev server on `http://127.0.0.1:3010`; it returned HTTP 200.
- Current blocker: this machine still has no `SUPABASE_SERVICE_ROLE_KEY`, so Codex cannot create confirmed Auth users until the key is supplied locally or the users are created in the Supabase Dashboard.

## 2026-06-18

- Added `docs/MAC_HANDOFF_2026-06-18.md` so the next Mac session can resume without relying on this chat.
- Marked public beta status as blocked until local testability is restored with fresh confirmed test users.
- Raised the Auth email confirmation friction risk because phone/public testing is currently blocked.
- Deferred SMTP and Supabase dashboard email-setting troubleshooting until the local MVP loop works again.
- Rechecked the previous mobile Safari login blocker.
- Confirmed latest code includes `/auth/reset-password` and recovery hash routing.
- Confirmed local `main` is aligned with `origin/main`.
- Confirmed public Vercel route `https://christian-app-project.vercel.app/auth/reset-password` returns HTTP 200.
- Re-ran `corepack pnpm verify`; lint, typecheck, and build all passed.
- Added `docs/MOBILE_AUTH_RECOVERY_TEST_2026-06-18.md` as the phone password recovery and login test runbook.
- Investigated failed mobile/password recovery attempts from Vercel logs.
- Confirmed phone requests reached Vercel, but Supabase rejected login attempts with `invalid_credentials`.
- Confirmed repeated reset requests hit Supabase `over_email_send_rate_limit` / HTTP 429.
- Added `TokenHash` password recovery support so reset emails can open the app first and verify only after the user taps a confirmation button.
- Added `docs/SUPABASE_AUTH_EMAIL_TEMPLATE.md` with the Supabase Reset Password template that should be pasted into the dashboard before sending new reset emails.
- Deferred SMTP troubleshooting so product development can continue without blocking on email deliverability.
- Improved check-in and prayer save feedback placement under the approved MVP beta stabilization ticket.
- Added `scripts/check-action-feedback-regression.mjs` and wired it into `scripts/verify.mjs`.
- Moved check-in success/failure feedback near today's status and prayer success/failure feedback inside the prayer cards anchor.
- Verified `corepack pnpm verify` passes after the feedback placement patch.
- Restarted the local dev server on `http://127.0.0.1:3010`; it returned HTTP 200.

## 2026-06-17

- Investigated the phone Safari/KakaoTalk login issue from screenshots and Vercel logs.
- Identified that the public app was loading, but phone login attempts were failing with Supabase `invalid_credentials` while the Codex browser still had an existing session cookie.
- Added a minimal auth recovery UX: new visitors default to `새 계정`, login failure copy explains separate browser sessions, email input is normalized, and existing users can request a password reset email from the login screen.
- Verified `corepack pnpm verify` passes after the auth recovery UX change.
- Found that Supabase password recovery emails returned to the app without a password reset screen.
- Added a recovery hash router and `/auth/reset-password` flow so recovery links can collect a new password.
- Verified `corepack pnpm verify` passes after the password reset flow: lint, typecheck, and build all passed.
- Ran the pre-beta gate after the Mac continuation work.
- Verified `corepack pnpm verify` passes locally: lint, typecheck, and build all passed.
- Verified the public Vercel URL returns HTTP 200 and renders Donghaeng Room app copy instead of the Supabase setup notice.
- Current result: still not ready for first real beta until the full public 1-leader/2-member smoke test is complete.
- Added `docs/PRE_BETA_GATE_2026-06-17.md` as the durable gate result.
- Added `docs/BETA_DATA_DELETION_RUNBOOK.md` to define the first-beta manual Supabase deletion process.
- Closed the "beta data deletion handling not defined" risk.
- Narrowed visibility helper copy from "언제든 수정" to "제출 전에 확인" so the app does not overpromise editability before beta.
- Closed the visibility copy risk; the remaining beta blocker is the full public leader/member smoke test.

## 2026-06-16

- Added Superpowers harness and reality review layers.
- Added active command layer under `superpowers/commands/`.
- Added project state files under `docs/`.
- Ran pre-beta readiness audit from code and documentation.
- Current result: Not ready for first real beta until public smoke test, deletion handling, and verification checks are complete.
- Ran Lane A backend/security stabilization for auth callback redirect safety and safe server-action failure redirects.
- Ran Lane B UX/onboarding stabilization for clearer no-group leader/member paths.
- Ran Lane C marketing/beta copy stabilization for copy-ready leader invite messaging.
- Ran Lane D QA/pre-beta stabilization with a manual first-beta checklist.
- Ran Lane E docs/state update to reflect stabilization progress and remaining beta blockers.
- Implemented leader-first beta UX refinement: leader care dashboard appears before personal check-in, invite message is compact/editable before copy, and daily rhythm copy clarifies once-a-day check-in.
