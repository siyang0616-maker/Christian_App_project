# Implementation Ticket

## Title

Leader-first beta UX refinement

## Approved Brief

Before the first beta, make the leader home screen prioritize member care and make invite message handling less visually dominant without expanding product scope.

Decision record:

- `superpowers/decisions/2026-06-16-leader-first-beta-ux-refinement.md`

## Scope

- Move the leader care dashboard above the leader's personal check-in flow on the authenticated home screen.
- Keep member home flow focused on the member's own check-in and prayer actions.
- Make the leader invite card compact by default.
- Show invite code and primary copy actions before the full invite message.
- Add an expand/collapse control for the invite message.
- Make the invite message text editable in the browser.
- Copy the current edited invite message text without saving the edit to Supabase.
- Clarify copy around today's rhythm so users understand it is a once-a-day check-in, not item-by-item time tracking.

## Files Likely To Change

- `app/page.tsx`
- `components/leader-invite-card.tsx`
- `components/check-in-form.tsx`
- `components/leader-dashboard.tsx` if care wording or compact summary needs adjustment
- `docs/BACKLOG.md` if deferred items are recorded

## Files Not To Touch

- `package.json`
- `pnpm-lock.yaml`
- `supabase/**`
- `middleware.ts`
- `lib/supabase/**`
- Database migrations or schema files
- Auth, RLS, payment, push, upload, AI, Bible content, chat, feed, or ERP-related files

## Technical Notes

- Do not persist custom invite message edits.
- Use local React state in the invite card for expanded state and editable message text.
- Keep copy actions working for invite code, invite link, and current invite message.
- Do not add dependencies.
- Keep mobile-first layout and stable button sizes.
- Keep leader-only components behind the existing leader role check.

## Privacy And Security Notes

- Do not expose additional private check-in or prayer data.
- Do not weaken visibility assumptions.
- Do not add tracking, scoring, or surveillance language.
- Keep invite links limited to the public app URL and invite code.
- Make it clear that today's rhythm is a lightweight daily check-in, not detailed behavior tracking.

## Acceptance Criteria

- A leader sees the care dashboard before personal check-in.
- A member does not see leader-only care dashboard or invite controls.
- The invite card initially shows code/link/copy actions without forcing the full message text area to dominate the screen.
- The full invite message can be expanded.
- The expanded invite message can be edited locally.
- The message copy button copies the edited text.
- Refreshing the page may reset the edited message; this is acceptable for MVP because edits are not persisted.
- Today's rhythm copy clearly says it is a once-a-day check-in.
- No database schema changes are made.
- No new dependency is added.
- No per-item timestamp, frequency tracking, or 0-10 mood score is added.

## Verification

- [ ] Lint
- [ ] Typecheck
- [ ] Build
- [ ] Manual mobile leader flow
- [ ] Manual mobile member flow
- [ ] Public beta smoke test if deployed before beta
