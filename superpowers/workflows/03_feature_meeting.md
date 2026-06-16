# Workflow 03: Feature Meeting

## Trigger

Before implementation starts for any user-facing, data-touching, or beta-impacting change.

## Goal

Approve, narrow, defer, or reject a feature before code changes.

## Required Input

- Feature brief or concise feature idea.
- Target user.
- User problem.
- Expected beta value.
- Known privacy or technical risks.

## Agents To Call

- Entrepreneur
- Designer
- Developer
- Security Reviewer
- QA Reviewer
- Marketer when copy, invite, onboarding, or positioning is involved

## Skills To Use

- feature-meeting
- competitor-differentiation
- implementation-plan if approved

## Step-By-Step Process

1. Summarize the proposal in one sentence.
2. Run the competitor differentiation review.
3. Ask each required agent for its review.
4. Identify the smallest version that can be tested.
5. State what is explicitly out of scope.
6. Decide build now, narrow, manual test, defer, reject, or investigate.
7. If build now, create an implementation ticket.

## Decision Gate

Implementation is allowed only after the meeting outputs an explicit "Build now" or "Build narrowed version" decision and lists acceptance criteria.

## Files To Update

- A filled copy of `superpowers/templates/feature-brief.md`.
- A filled copy of `superpowers/templates/implementation-ticket.md` if approved.
- `docs/MVP_SCOPE.md` or `docs/PROJECT_STATUS.md` only if scope changes.

## Final Output Format

```md
## Feature Meeting Decision

Decision:
- Build now / Build narrowed version / Manual test / Defer / Reject / Investigate

Approved Scope:
- ...

Out Of Scope:
- ...

Acceptance Criteria:
- ...

Implementation Ticket:
- ...
```
