# Worklog

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
