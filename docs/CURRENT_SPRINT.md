# Current Sprint

## Sprint Name

Pre-beta stabilization

## Sprint Goal

Make Donghaeng Room ready for one real leader and two members to complete the first beta loop safely.

## Top Priorities

1. Run lint, typecheck, and build in an environment with `pnpm` and dependencies installed.
2. Complete public URL smoke test.
3. Define beta data deletion request handling.
4. Verify auth, invite, check-in, prayer, visibility, and leader dashboard flows using `docs/QA_CHECKLIST.md`.

## Active Ticket

- `superpowers/tickets/2026-06-16-mvp-beta-stabilization.md`

## Ready To Work

- Run `superpowers/commands/pre-beta.md` to audit readiness.
- Run `superpowers/commands/qa.md` to produce and execute QA checklist.
- Run `superpowers/commands/feature.md` before any new meaningful change.

## Stabilization Done Locally

- Auth callback redirect safety and safe server-action error redirects.
- Clear no-group leader/member first-use paths.
- Copy-ready leader invite message wording.
- Manual first-beta QA checklist.

## Not In Sprint

- New app features beyond stabilization.
- New dependencies.
- Database schema changes.
- Paid services.
- Chat, feed, AI, Bible content, native app, push, upload, payment, ERP.
