# Backlog

## Now

- Restore local testability with fresh confirmed leader/member test users.
- Verify the local 1-leader/1-member MVP loop before returning to public smoke testing.
- Public URL smoke test for 1 leader and 2 members.
- Verify auth redirect, group create, invite, join, check-in, prayer, "기도했어요", and leader dashboard.
- Execute `docs/QA_CHECKLIST.md`.

## Next

- Patch only verified beta blockers.
- Retest public phone login with a fresh confirmed test user.
- Test the new Leader Care Board v1 with 1 leader and 2 members:
  - date-grouped prayer memory
  - member care snapshots
  - manual copy-ready care messages
  - anonymous prayer author masking
- Create first beta runbook from `superpowers/templates/beta-test-runbook.md` if needed.
- Record first beta feedback using existing leader/member feedback forms.
- Run `superpowers/commands/parallel-merge-review.md` after verification.

## Later

- Improve onboarding only after beta evidence.
- Improve leader dashboard only after leader feedback.
- Leader Care Board v1.5 candidates, only if leaders say this helps weekly care:
  - birthday reminders as a small care cue, not a social feed
  - manual contact shortcuts or copy-ready individual care messages, not in-app chat
  - simple gathering RSVP for one upcoming meeting, not attendance scoring
  - a leader/member notification inbox inside the app, not push/SMS/Kakao yet
  - clearer "prayed for this" feedback so members know their request was remembered
- Consider edit/delete UX only after privacy and beta needs are confirmed.

## Deferred / Avoid

- Full chat.
- BAND-style board/feed.
- Bible content.
- AI devotional/prayer generation.
- Push/SMS/Kakao API.
- Payment.
- File upload/storage.
- Native app.
- Church ERP.
