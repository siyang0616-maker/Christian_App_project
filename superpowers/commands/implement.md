# Implementation Command

## Purpose

Implement only the approved scope from an implementation ticket.

## When To Run

- After `superpowers/commands/feature.md` approves Build or Simplify.
- After the user explicitly asks to implement an approved ticket.

## Required Inputs

- Path to the approved implementation ticket.
- Any user constraints for the current session.
- Target verification environment if known.

## Files To Read First

- `AGENTS.md`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_SPRINT.md`
- `docs/RISK_REGISTER.md`
- The approved implementation ticket under `superpowers/tickets/`
- Related decision record under `superpowers/decisions/`
- `superpowers/workflows/04_implementation.md`
- `superpowers/skills/implementation-plan.md`
- Relevant agent files named in the ticket

## Agents To Invoke

- Developer
- Security Reviewer if auth, RLS, membership, visibility, prayer, check-in, or invite behavior is touched
- Designer if UI or copy changes
- QA Reviewer for verification
- Entrepreneur if scope needs to be narrowed during implementation

## Skills/Workflows To Invoke

- `superpowers/workflows/04_implementation.md`
- `superpowers/skills/implementation-plan.md`
- `superpowers/skills/qa-check.md`
- `superpowers/skills/privacy-risk-review.md` when sensitive data is touched

## Output Format

```md
## Implementation Result

Ticket:
- ...

Changed Files:
- ...

Verification:
- Lint:
- Typecheck:
- Build:
- Manual checks:

Scope Guard:
- Dependencies added: No / Yes
- Database schema changed: No / Yes
- Unapproved features added: No / Yes

Follow-Up:
- ...
```

## Files To Update

- Only files required by the approved ticket.
- `docs/WORKLOG.md` with implementation summary.
- `docs/RISK_REGISTER.md` if new risks are found.
- `docs/BETA_STATUS.md` if beta readiness changes.

## Stop Conditions

- No approved implementation ticket is provided.
- The work requires an unapproved feature.
- The work requires new dependencies or database schema changes not approved by a decision record.
- The scope expands beyond the ticket.

## Acceptance Criteria

- Reads the approved ticket first.
- Implements only approved scope.
- Does not add unapproved features.
- Runs lint, typecheck, and build when dependencies are available.
- Reports any verification that could not be run.
