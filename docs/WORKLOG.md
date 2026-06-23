# Worklog

## 2026-06-23

- Care Thread v0: care_messages table + RLS + sendCareMessage action + member/leader thread UI.
- Ticket 1 implementation merged: inviteCode preservation, returnTo validation, create_group_with_leader RPC.

## 2026-06-22

- Fixed the `/leader` dev overlay caused by the optional `leader_prayer_care_marks` query:
  - changed the optional care-mark fetch from hard `console.error` logging to optional warning logging
  - protected this with `scripts/check-leader-care-board-regression.mjs`
- Reworked the Leader Care Board for the real 10-20 member use case:
  - replaced the member card stack with a compact `멤버 상태판` matrix
  - shows each member's `안부`, `기도`, and rhythm completion at row level
  - keeps detailed rhythm status and reminder/share text inside an expandable row
  - raises the visible member scan limit to 20 so small-group leaders can inspect the whole room without scrolling through oversized cards
  - kept member-facing pressure low: no scoring, ranking, attendance policing, chat, or paid notification integration
- Verification passed:
  - `node scripts/check-modern-ui-regression.mjs`
  - `node scripts/check-leader-care-board-regression.mjs`
  - `corepack pnpm lint`
  - `corepack pnpm typecheck`
  - `corepack pnpm build`
  - `corepack pnpm verify`
- Next product decision:
  - Birthdays, anniversaries, and important care dates are a real leader-care need for 10-20 members.
  - Do not fake this as static UI. Implement it as a leader-only, schema-backed care-date feature with RLS so the data can actually persist and remain private.
  - Proposed next slice: `member_care_dates` table + leader-only RLS + member row display + small add/edit form.

- Updated the check-in and leader dashboard connection so leaders can understand member state from existing MVP data without schema changes:
  - grouped member check-in input into `오늘 시작`, `말씀과 기도`, and `예배와 모임`
  - made the member check-in copy explain that only visible check-ins appear in the leader dashboard
  - added member-level `rhythmStatus`, `missingRhythmLabels`, and `rhythmCompletionLabel` to the Leader Care Board data model
  - changed the leader side panel into `멤버 리듬 한눈에` so leaders can see today check-in, 말씀, 기도, 묵상, 예배/모임, and prayer-request state per member
  - kept the wording care-oriented and avoided attendance scoring, rankings, push/SMS/Kakao API, or new database schema
  - deferred service-specific attendance, schedules, RSVP, birthdays, and notification inbox to a later schema-backed design
- User feedback: the app still did not feel modern enough, and the leader dashboard was not easy to scan when several members and prayer requests accumulate.
- Decision: make a narrowed UI/UX modernization pass without adding new product features, schema, dependencies, chat, schedules, RSVP, or notifications.
- Added decision record `superpowers/decisions/2026-06-22-modern-ui-dashboard-pass.md`.
- Added implementation ticket `superpowers/tickets/2026-06-22-modern-ui-dashboard-pass.md`.
- Added `scripts/check-modern-ui-regression.mjs` and wired it into `scripts/verify.mjs`.
- Updated `/leader` to use a wider responsive shell instead of the narrow mobile-only width on desktop/tablet.
- Reorganized the Leader Care Board into:
  - summary metrics
  - priority panel
  - prayer timeline
  - sticky member care panel
- Reworked prayer care controls so `함께 기도`, `개별 돌봄`, `중요`, and `계속 기억` feel like clear leader-only controls.
- Replaced the native visibility select with touch-friendly radio cards so members can understand visibility before submitting sensitive content.
- Polished member-facing check-in, prayer form, today status, and prayer cards with modern rounded surfaces and calmer shadows.
- Verified the modern UI regression script passes.
- Verified `corepack pnpm typecheck` passes.
- Reworked the leader member-care helper from a copy-only card into a `멤버 오늘 할 일 리마인드` panel:
  - shows whether each member still needs `오늘 체크인` or `기도제목` follow-up
  - adds native mobile share, SMS-open, and copy fallback through `components/share-text-actions.tsx`
  - keeps the app out of Kakao/SMS API, push notification, and paid messaging scope
- Verified `node scripts/check-modern-ui-regression.mjs`, `node scripts/check-leader-care-board-regression.mjs`, `corepack pnpm lint`, `corepack pnpm typecheck`, `corepack pnpm build`, and `corepack pnpm verify`.

## 2026-06-21

- Responded to user feedback that the UI still felt childish/prototype-like.
- Ran senior design, marketer/CEO, and frontend QA review for a more mature mobile product direction.
- Applied a stricter mature UI pass without adding product scope, schema, dependencies, chat, feed, push, or Kakao-send behavior:
  - flattened the app surface to a quieter warm-gray mobile shell
  - reduced oversized card shadows, pastel pills, and decorative icon circles
  - tightened home/auth/profile/reset/group screens into simpler white surfaces with subtle borders
  - changed Leader Care Board framing from a decorative dashboard to `오늘 먼저 살필 것`
  - moved member care copy above older prayer history so leaders can act faster
  - changed member copy labels to `보낼 문장` / `님에게 보낼 문장`
  - kept copy-only behavior so the app helps leaders prepare messages without becoming chat or Kakao integration
- Updated regression checks so the more mature surface, leader-first hierarchy, and no-chat boundary are protected.
- Verified the full suite with `corepack pnpm verify`.
- Confirmed the local `/leader` route returns HTTP 200.

- Applied a senior-design polish pass inspired by Apple/KakaoTalk/LINE interaction principles without copying their product scope:
  - replaced the decorative radial background with a calmer system-app gradient
  - updated the font stack to native Apple/system Korean fonts first
  - added a lightweight sticky glass header for a more app-like mobile surface
  - softened Leader Care Board panels from heavy card stacks to lighter blurred surfaces
  - collapsed older prayer date groups behind `이전 기도제목 더 보기` so growing groups stay scannable
  - incorporated senior marketer, CEO/SEO, and frontend/QA review:
    - tightened metadata away from Bible-app positioning toward small-group check-in and prayer memory
    - changed first-screen copy to `오늘 안부와 기도제목`
    - added leader-board privacy reassurance before showing member/prayer data
    - reduced direct Kakao wording in controls while keeping copy-ready handoff behavior
    - improved sticky-header anchor offset, long-name wrapping, and disclosure focus states
- Verified the full suite with `corepack pnpm verify`.

- Improved Leader Care Board scalability for growing groups:
  - kept member care messages copy-only instead of adding Kakao/chat/send behavior
  - shows the first 4 member care copy cards by default
  - moves additional member cards behind `나머지 멤버 안부 문구` disclosure
  - extracted member care copy card rendering so long-list UI stays consistent
- Verified the full suite with `corepack pnpm verify`.

- Clarified the leader member-care copy helper after user feedback:
  - kept KakaoTalk as a UX reference only, not a feature target
  - removed the auto-share direction from scope and kept the flow copy-first
  - changed the member care helper to show `보낼 대상`, `카톡 말풍선 미리보기`, and a single copy action
  - updated the leader care board regression to protect the no-chat/no-send MVP boundary
- Verified the full suite with `corepack pnpm verify`.

- Ran expert UX, marketing, product, and engineering review for the next quality pass.
- Implemented the first safe UX/UI slice without schema or dependency changes:
  - moved today's check-in status and check-in form above prayer and leader sections on the home screen
  - softened check-in copy from a heavier rhythm frame to `오늘 안부 남기기`
  - shortened the default leader invite message for KakaoTalk-style beta sharing
  - updated regression checks to protect the new mobile-first order
- Verified the full suite with `corepack pnpm verify`.

## 2026-06-20

- Improved beta UX quality without adding new product scope:
  - Leader home care summary now separates `오늘 먼저 살필 것`, `새 기도제목`, and `멤버 안부`.
  - Prayer cards now make visibility and `기도로 기억 중` state clearer.
  - Check-in activity cards and today's status now summarize selected daily rhythm items.
  - Empty states now explain that data will appear after visible check-ins/prayers are submitted.
- Added `scripts/check-beta-quality-copy-regression.mjs` and wired it into `corepack pnpm verify`.
- Verified the full suite with `corepack pnpm verify`.

## 2026-06-20

- Investigated the live profile-save blocker after confirmed login reached the profile setup screen.
- Added safe server-side diagnostics for `saveProfile` failures while keeping the user-facing error generic.
- Added `supabase/diagnostics/profile_save_diagnostics.sql` so the live Supabase project can be checked for Data API grants, RLS, profile policies, and `join_group_by_code` execute privilege.
- Added a regression check to keep the profile-save diagnostics and safe redirect behavior in `corepack pnpm verify`.

## 2026-06-20

- Public login reached the profile setup screen, but profile save failed with the safe user-facing `profile-save` message.
- Root-cause candidate: the live Supabase project may have RLS policies but be missing explicit Data API grants for `authenticated`.
- Supabase changelog confirms newer projects may not expose public tables to the Data API automatically.
- Added `supabase/migrations/005_data_api_grants.sql` to grant authenticated Data API access while keeping RLS as the row-level guard.
- Updated `supabase/schema.sql` and `supabase/repair_after_partial_schema.sql` so future full/repair SQL includes the grants.
- Added `scripts/check-data-api-grants-regression.mjs` and wired it into `corepack pnpm verify`.
- Added `docs/SUPABASE_DATA_API_GRANTS.md` for the exact SQL Editor step before retrying profile save.
- Verified `corepack pnpm verify` passes with the new Data API grant regression.

## 2026-06-19

- Worker D documentation pass: updated beta/manual QA docs for the latest leader-first UX.
- Aligned `docs/QA_CHECKLIST.md` around 1 leader + 2 members, prayer cards/form first, leader care signals, bottom/collapsed invite, and current visibility labels `리더와 나` / `이름 숨김`.
- Updated `docs/BETA_STATUS.md` to keep the beta gate blocked until the full local/public 1-leader/2-member smoke test verifies those flows.
- Kept this pass documentation-only and deferred any RLS deep dive unless manual smoke testing shows a visible privacy leak.
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
