# Implementation Ticket: Modern UI Dashboard Pass

## Approved Brief

Improve the current Donghaeng Room UX/UI without adding new product features.
Focus on modern visual polish, leader dashboard scanability, and member input comfort.

## Scope

- Responsive leader dashboard layout.
- Leader board visual hierarchy.
- Prayer care controls polish.
- Member check-in/prayer form polish.
- Card-based visibility selector.
- Regression guard for modern UI expectations.

## Files Likely To Change

- `components/app-shell.tsx`
- `components/leader-care-board.tsx`
- `components/check-in-form.tsx`
- `components/prayer-request-form.tsx`
- `components/prayer-request-list.tsx`
- `components/today-status.tsx`
- `components/visibility-select.tsx`
- `scripts/check-modern-ui-regression.mjs`
- `scripts/verify.mjs`

## Files Not To Touch

- Supabase schema and migrations.
- Auth logic.
- Server action data behavior.
- Package dependencies.

## Technical Notes

- No new dependency.
- Use existing Tailwind utility patterns.
- Preserve existing form field names and server actions.
- Keep the leader-only care mark behavior unchanged.

## Privacy And Security Notes

- Visibility selection must remain visible before submission.
- Leader-only care mark copy must not imply members can see leader classifications.
- No new exposure of private, leader-only, or anonymous prayer data.

## Acceptance Criteria

- `/leader` uses a wider desktop layout.
- Leader board separates priority, prayer timeline, and member care panels.
- Visibility selector uses touch-friendly radio cards instead of a plain select.
- Regression script covers the UI structure.
- `corepack pnpm verify` passes.

## Verification

- [ ] `node scripts/check-modern-ui-regression.mjs`
- [ ] `corepack pnpm lint`
- [ ] `corepack pnpm typecheck`
- [ ] `corepack pnpm build`
- [ ] `corepack pnpm verify`
