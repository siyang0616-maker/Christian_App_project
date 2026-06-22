# Backlog

## Now

- Test the modern UI dashboard + 10-20 member matrix pass:
  - wider `/leader` layout
  - scannable leader priority, prayer, and member care panels
  - compact `멤버 상태판` matrix for today check-in, prayer request, 말씀, 기도, 묵상, 예배/모임, and member care status
  - expandable member rows for reminder text and rhythm detail
  - member reminder share/SMS/copy flow
  - touch-friendly visibility selector
- Restore local testability with fresh confirmed leader/member test users.
- Verify the local 1-leader/1-member MVP loop before returning to public smoke testing.
- Test the upgraded Leader Care Board no-schema v1.1 / v1.5 pass:
  - care-priority sorting
  - copy-ready message preview
  - leader can mark visible prayers as remembered from `/leader`
  - anonymous prayer masking
  - `/leader` refresh after check-in, prayer, reaction, group create, and join
- Implement and test leader-only prayer care marks:
  - `함께 기도`
  - `개별 돌봄`
  - `중요`
  - `계속 기억`
  - RLS prevents member access to care marks
- Public URL smoke test for 1 leader and 2 members.
- Verify auth redirect, group create, invite, join, check-in, prayer, "기도했어요", and leader dashboard.
- Execute `docs/QA_CHECKLIST.md`.

## Next

- Implement leader-only member care dates for 10-20 member care:
  - schema-backed `member_care_dates` or equivalent table
  - leader-only RLS for birthday, anniversary, and important care-date notes
  - display upcoming dates inside the leader dashboard/member matrix
  - add/edit form that does not expose private leader notes to members
  - keep this as care memory, not a social feed or church ERP calendar
- Patch only verified beta blockers.
- Retest public phone login with a fresh confirmed test user.
- Create first beta runbook from `superpowers/templates/beta-test-runbook.md` if needed.
- Record first beta feedback using existing leader/member feedback forms.
- Run `superpowers/commands/parallel-merge-review.md` after verification.

## Later

- Improve onboarding only after beta evidence.
- Improve leader dashboard only after leader feedback.
- Leader Care Board v1.5 candidates, only if leaders say this helps weekly care:
  - service-specific check-in categories for 새벽예배, 주일예배, 수요예배, 금요예배, and small-group gathering status
  - simple gathering RSVP for one upcoming meeting, not attendance scoring
  - a leader/member notification inbox inside the app, not push/SMS/Kakao yet
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
