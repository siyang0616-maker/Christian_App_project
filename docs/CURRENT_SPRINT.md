# Current Sprint

## Sprint Name

Pre-beta stabilization

## Sprint Goal

Make Donghaeng Room ready for one real leader and two members to complete the first beta loop safely.

## Top Priorities

1. Complete the full public 1-leader/2-member smoke test.
2. Verify auth, invite, check-in, prayer, visibility, and leader dashboard flows using `docs/QA_CHECKLIST.md`.
3. Patch only blockers found in that smoke test.

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
- Lint/typecheck/build verification.
- Basic public URL HTTP check.
- First-beta data deletion runbook.
- Safer visibility helper copy that does not overpromise editability.

## Not In Sprint

- New app features beyond stabilization.
- New dependencies.
- Database schema changes.
- Paid services.
- Chat, feed, AI, Bible content, native app, push, upload, payment, ERP.
