# Implementation Ticket

## Title

Leader Care Board no-schema v1.1 / v1.5 upgrade

## Approved Brief

Decision record: `superpowers/decisions/2026-06-19-leader-care-board-no-schema-upgrade.md`

## Scope

- Improve Leader Care Board prioritization and care copy without adding schema.
- Show copy-ready message previews before copy actions.
- Make today check-in count member-focused.
- Let leaders mark visible prayer requests as remembered/prayed from `/leader` using existing `prayer_reactions`.
- Revalidate `/leader` after check-in, prayer, prayer reaction, create-group, and join-group actions.

## Files Likely To Change

- `lib/data/leader-care-board.ts`
- `components/leader-care-board.tsx`
- `components/leader-dashboard-view.tsx`
- `app/leader/page.tsx`
- `lib/actions/prayers.ts`
- `lib/actions/check-ins.ts`
- `lib/actions/groups.ts`
- `scripts/check-leader-care-board-regression.mjs`
- `docs/BACKLOG.md`
- `docs/WORKLOG.md`
- `docs/DECISION_LOG.md`

## Files Not To Touch

- `package.json`
- `supabase/schema.sql`
- `supabase/migrations/*`
- auth middleware
- RLS functions and policies

## Technical Notes

- Keep the work server-rendered and RLS-visible.
- Do not introduce realtime, notifications, chat, schedule, RSVP, or birthday data.
- Use existing `prayForRequest` server action for leader-board prayer reaction.
- Keep anonymous prayers un-attributed and without copy-ready author messages.

## Privacy And Security Notes

- No private content should appear in leader totals or summaries.
- Anonymous prayers must render as `익명` and remain excluded from member attribution.
- Copy-ready text must stay generic and must not include raw prayer content, check-in notes, user IDs, group IDs, or invite codes.
- No `service_role` key in app code, Vercel, or client-visible env vars.

## Acceptance Criteria

- Leader can see the highest-priority care cues first.
- Summary labels feel like care, not attendance tracking.
- Leader can mark a visible prayer as remembered from `/leader`.
- The action returns to `/leader#leader-prayer-timeline`.
- Copy-preview text is visible before copying.
- No DB migration, new dependency, chat/feed/ERP behavior, or stored contact feature is added.

## Verification

- [ ] Leader care regression
- [ ] Lint
- [ ] Typecheck
- [ ] Build
- [ ] Local HTTP check for `/leader`
- [ ] Manual leader/member privacy smoke test when test users are available
