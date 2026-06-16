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
- [ ] Beta data deletion handling is defined.

## Stabilization Status

- [x] Auth callback redirect safety patched locally.
- [x] Safe server-action failure redirects patched locally.
- [x] First-use leader/member paths clarified locally.
- [x] Copy-ready leader invite message updated locally.
- [x] Manual QA checklist created.
- [ ] Lint/typecheck/build completed after these changes.
- [ ] Public URL smoke test completed after these changes.

## Current Blockers

- Public URL smoke test not completed in this session.
- Beta data deletion process not defined.
- Verification commands not run in this session because `pnpm` and dependencies are not available locally.

## Beta Feedback Assets

- `docs/BETA_TEST_GUIDE.md`
- `docs/BETA_INVITE_MESSAGE.md`
- `docs/QA_CHECKLIST.md`
- `docs/LEADER_FEEDBACK_FORM.md`
- `docs/MEMBER_FEEDBACK_FORM.md`
- `docs/POST_BETA_REVIEW.md`
