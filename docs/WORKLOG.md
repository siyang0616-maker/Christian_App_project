# Worklog

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
