# Beta Status

## Current Decision

Not ready for first real beta.

## Target Beta

- 1 real leader
- 2 members
- 1 week
- Public Vercel URL

## Must Pass Before Invite

- [ ] Public URL opens on mobile.
- [ ] Leader can sign up, confirm email, log in, create profile, and create room.
- [ ] Leader can copy invite message/code.
- [ ] Two members can join.
- [ ] Member can check in within 2 minutes.
- [ ] Member understands visibility before check-in/prayer submission.
- [ ] Prayer card and "기도했어요" work.
- [ ] Leader dashboard is care-oriented and useful.
- [ ] Invalid invite code and failed actions show safe errors.
- [ ] Private/anonymous data does not leak.
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
- [ ] Full public leader/member smoke test completed after these changes.

## Current Blockers

- Password recovery patch needs deployment and public URL retest.
- Full public leader/member smoke test not completed in this session.

## Current Phone Test Runbook

- `docs/MOBILE_AUTH_RECOVERY_TEST_2026-06-18.md`

## Beta Feedback Assets

- `docs/BETA_TEST_GUIDE.md`
- `docs/BETA_INVITE_MESSAGE.md`
- `docs/QA_CHECKLIST.md`
- `docs/LEADER_FEEDBACK_FORM.md`
- `docs/MEMBER_FEEDBACK_FORM.md`
- `docs/POST_BETA_REVIEW.md`
- `docs/PRE_BETA_GATE_2026-06-17.md`
- `docs/BETA_DATA_DELETION_RUNBOOK.md`
