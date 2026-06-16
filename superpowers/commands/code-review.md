# Code Review Command

## Purpose

Review implementation changes for regressions, privacy risk, scope drift, and missing verification.

## When To Run

- After implementation.
- Before commit, push, deployment, or beta testing.
- When reviewing changes from a previous session or machine.

## Required Inputs

- Current diff or changed file list.
- Related decision record and implementation ticket.
- Verification results if available.
- Known unresolved issues.

## Files To Read First

- `AGENTS.md`
- `docs/PROJECT_STATE.md`
- `docs/RISK_REGISTER.md`
- `docs/DECISION_LOG.md`
- Related `superpowers/tickets/*`
- Related `superpowers/decisions/*`
- `superpowers/workflows/05_code_review.md`
- `superpowers/skills/code-review.md`
- `superpowers/agents/developer.md`
- `superpowers/agents/security-reviewer.md`
- `superpowers/agents/qa-reviewer.md`

## Agents To Invoke

- Developer
- Security Reviewer
- QA Reviewer
- Designer if UI or copy changed
- Entrepreneur if scope changed
- Privacy Officer if prayer, check-in, membership, or visibility changed

## Skills/Workflows To Invoke

- `superpowers/workflows/05_code_review.md`
- `superpowers/skills/code-review.md`
- `superpowers/skills/qa-check.md`
- `superpowers/skills/privacy-risk-review.md` when sensitive data changed

## Output Format

```md
## Code Review Result

Findings:
- [P1/P2/P3] ...

Required Fixes:
- ...

Verification:
- Lint:
- Typecheck:
- Build:

Decision:
- Approve / Fix first / Block

Scope Drift:
- ...
```

## Files To Update

- `docs/WORKLOG.md` with review summary.
- `docs/RISK_REGISTER.md` when risks are found.
- `docs/BETA_STATUS.md` if readiness changes.
- Implementation ticket status if a ticket-tracking convention is added later.

## Stop Conditions

- Critical privacy leak.
- Auth, invite, check-in, prayer, or leader dashboard regression.
- Unapproved dependency, schema change, or feature expansion.
- Verification cannot be run and manual review is insufficient for risk level.

## Acceptance Criteria

- Reviews code after implementation.
- Invokes developer, security-reviewer, and qa-reviewer.
- Invokes designer if UI changed.
- Invokes entrepreneur if scope changed.
- Runs lint, typecheck, and build when dependencies are available.
- Produces required fixes before summary.
