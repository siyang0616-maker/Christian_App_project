# Feature Meeting Command

## Purpose

Run a structured pre-implementation feature meeting and decide whether a requested feature or meaningful UX change should be built, simplified, deferred, or removed.

## When To Run

- Before any feature implementation.
- Before meaningful UX, onboarding, invite, dashboard, privacy, or copy changes.
- When a request could affect MVP scope, sensitive data, beta readiness, or comparison-product drift.

## Required Inputs

- Feature idea or UX change.
- Target user: leader, member, or operator.
- Problem being solved.
- Known evidence or assumption.
- Desired beta outcome.

## Files To Read First

- `AGENTS.md`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_SPRINT.md`
- `docs/RISK_REGISTER.md`
- `docs/DECISION_LOG.md`
- `superpowers/workflows/03_feature_meeting.md`
- `superpowers/skills/feature-meeting.md`
- `superpowers/skills/competitor-differentiation.md`
- `superpowers/templates/decision-record.md`
- `superpowers/templates/implementation-ticket.md`
- `superpowers/agents/developer.md`
- `superpowers/agents/entrepreneur.md`
- `superpowers/agents/designer.md`
- `superpowers/agents/marketer.md`
- `superpowers/agents/security-reviewer.md`
- `superpowers/agents/qa-reviewer.md`

## Agents To Invoke

- Developer
- Entrepreneur
- Designer
- Marketer
- Security Reviewer
- QA Reviewer
- Privacy Officer when prayer, check-in, visibility, membership, invite links, or beta data are touched
- Beta Operator when beta operations are touched
- Retention Analyst when repeated use is part of the claim

## Skills/Workflows To Invoke

- `superpowers/workflows/03_feature_meeting.md`
- `superpowers/skills/feature-meeting.md`
- `superpowers/skills/competitor-differentiation.md`
- `superpowers/skills/privacy-risk-review.md` when sensitive data is touched
- `superpowers/skills/cost-risk-review.md` when infrastructure or paid-service risk exists

## Output Format

```md
## Feature Meeting Result

Feature:
- ...

Comparison Review:
- KakaoTalk:
- Naver BAND:
- YouVersion:
- Hallow / Glorify / Pray.com:
- Planning Center / Church Center:

Agent Decisions:
- Developer:
- Entrepreneur:
- Designer:
- Marketer:
- Security:
- QA:

Decision:
- Build / Simplify / Defer / Remove

Approved Scope:
- ...

Out Of Scope:
- ...

Artifacts:
- Decision record:
- Implementation ticket:
```

## Files To Update

- Create a decision record under `superpowers/decisions/`.
- Create an implementation ticket under `superpowers/tickets/` only when decision is Build or Simplify.
- Update `docs/DECISION_LOG.md`.
- Update `docs/BACKLOG.md` when an item is added, deferred, or removed.
- Update `docs/RISK_REGISTER.md` when new risks are identified.

## Stop Conditions

- The request asks to implement immediately without feature meeting output.
- The idea mainly imitates KakaoTalk, Naver BAND, YouVersion, Hallow/Glorify/Pray.com, or Planning Center.
- The idea requires new dependencies, database schema changes, paid APIs, AI, push, SMS, upload, or native app work without explicit approval.

## Acceptance Criteria

- Compares against all five comparison product groups.
- Decides Build, Simplify, Defer, or Remove.
- Creates a decision record.
- Creates an implementation ticket if approved.
- Does not implement app code.
