# Implementation Ticket

## Title

Leader-only prayer care marks

## Approved Brief

Add the smallest DB-backed leader care layer so leaders can classify prayer requests as communal or personal, mark important requests, and keep ongoing prayer requests visible on the leader dashboard.

## Scope

- Add `leader_prayer_care_marks` table with RLS for leaders only.
- Add server action to save a care mark for a visible prayer.
- Fetch care marks only for `/leader`.
- Render simple controls on each leader prayer timeline card:
  - `함께 기도`
  - `개별 돌봄`
  - `중요`
  - `계속 기억`
- Add a small leader-only grouping/count cue for care marks.

## Files Likely To Change

- `supabase/schema.sql`
- `supabase/migrations/004_leader_prayer_care_marks.sql`
- `lib/types.ts`
- `lib/validation.ts`
- `lib/actions/prayers.ts`
- `lib/data/leader-dashboard.ts`
- `lib/data/leader-care-board.ts`
- `components/leader-care-board.tsx`
- `scripts/check-leader-care-board-regression.mjs`
- `docs/DECISION_LOG.md`
- `docs/BACKLOG.md`
- `docs/WORKLOG.md`

## Files Not To Touch

- Auth callback and password reset flow.
- Member check-in form behavior.
- Invite link generation.
- Package manager or dependencies.

## Technical Notes

- Do not overload `prayer_reactions`.
- Derive `group_id` on the server from the prayer row, not from form input.
- Revalidate `/leader` after saving.
- Keep the home member dashboard from selecting care marks.

## Privacy And Security Notes

- Members must not be able to read, insert, update, or delete care marks.
- Anonymous prayer authors must remain hidden.
- Leader labels must stay prayer-card scoped, not member-profile scoped.

## Acceptance Criteria

- A leader can mark a visible prayer as `함께 기도` or `개별 돌봄`.
- A leader can set or clear `중요`.
- A leader can set or clear `계속 기억`.
- The leader dashboard shows the saved values after redirect.
- Member-facing prayer cards do not show leader classification labels.
- RLS policies restrict the new table to group leaders.

## Verification

- [ ] Regression script
- [ ] Lint
- [ ] Typecheck
- [ ] Build
- [ ] Manual leader flow
