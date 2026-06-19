# Beta Status

## Current Decision

Blocked for first real beta.

## Target Beta

- 1 real leader
- 2 members
- 1 week
- Public Vercel URL

## Must Pass Before Invite

- [ ] Public URL opens on mobile.
- [ ] Leader can sign up or be created as a confirmed test user, log in, create profile, and create room.
- [ ] Joined room opens with prayer cards and the prayer request form first.
- [ ] Leader sees care-oriented summary/signals before personal check-in.
- [ ] Leader invite stays collapsed at the bottom by default, then shows code/copy controls when opened.
- [ ] Two members can join.
- [ ] Member can check in within 2 minutes.
- [ ] Member understands visibility before check-in/prayer submission, especially `리더와 나` and prayer-only `이름 숨김`.
- [ ] Prayer card and "기도했어요" work.
- [ ] Leader can use care signals on visible prayers: `함께 기도`, `개별 돌봄`, `중요`, `계속 기억`.
- [ ] Member-facing cards do not show leader-only care labels.
- [ ] Leader dashboard is care-oriented and useful.
- [ ] Invalid invite code and failed actions show safe errors.
- [ ] `나만 보기`, `리더와 나`, and `이름 숨김` behavior does not leak to the wrong viewer.
- [x] Feedback guide or forms are ready.
- [x] Manual QA checklist is ready.
- [x] Beta data deletion handling is defined.

## Stabilization Status

- [x] Auth callback redirect safety patched locally.
- [x] Safe server-action failure redirects patched locally.
- [x] First-use leader/member paths clarified locally.
- [x] Copy-ready leader invite message updated locally.
- [x] Manual QA checklist created.
- [x] Lint/typecheck/build completed after these changes.
- [x] Basic public URL HTTP smoke test completed after these changes.
- [x] Password recovery link handling patched locally with `/auth/reset-password`.
- [x] TokenHash password recovery support added for mobile/email-app-safe reset links.
- [x] Check-in and prayer save feedback placement improved locally.
- [x] Action feedback regression added to `corepack pnpm verify`.
- [x] Latest leader-first UX is reflected locally: prayer cards/form first, leader care signals before personal check-in, and invite at the bottom/collapsed.
- [x] Current visibility wording is reflected locally: `리더와 나` and prayer-only `이름 숨김`.
- [x] Leader prayer care marks are implemented locally for `/leader`: `함께 기도`, `개별 돌봄`, `중요`, `계속 기억`.
- [ ] Full public leader/member smoke test completed after these changes.

## Current Blockers

- Supabase Auth email flow is blocking public phone testing.
- Supabase dashboard could not save the `Confirm email` toggle because it returned `Failed to update settings: Failed to fetch (api.supabase.com)`.
- Password recovery requests hit Supabase `over_email_send_rate_limit` / HTTP 429 during repeated testing.
- Supabase Auth users were deleted during troubleshooting, so fresh confirmed test users must be created before the next smoke test.
- Full public leader/member smoke test is not complete.

## Next Safe Path

- Do not continue SMTP troubleshooting first.
- On Mac, restore local testability with fresh confirmed test users or a strictly local-only test path.
- Verify the local 1-leader/2-member MVP loop before returning to public Vercel/mobile testing.
- Keep today's QA pass focused on manual UX and visible privacy behavior; defer any RLS deep dive unless the smoke test shows a visible leak.

## Current Phone Test Runbook

- `docs/MOBILE_AUTH_RECOVERY_TEST_2026-06-18.md`
- `docs/SUPABASE_AUTH_EMAIL_TEMPLATE.md`
- `docs/MAC_HANDOFF_2026-06-18.md`

## Beta Feedback Assets

- `docs/BETA_TEST_GUIDE.md`
- `docs/BETA_INVITE_MESSAGE.md`
- `docs/QA_CHECKLIST.md`
- `docs/LEADER_FEEDBACK_FORM.md`
- `docs/MEMBER_FEEDBACK_FORM.md`
- `docs/POST_BETA_REVIEW.md`
- `docs/PRE_BETA_GATE_2026-06-17.md`
- `docs/BETA_DATA_DELETION_RUNBOOK.md`
