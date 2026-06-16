# Roadmap Command

## Purpose

Update roadmap, backlog, and current sprint based on decisions, QA results, beta evidence, and risks.

## When To Run

- After a feature meeting.
- After QA or pre-beta audit.
- After a beta retrospective.
- When priorities feel unclear.

## Required Inputs

- Latest decision records.
- QA or beta results.
- Current sprint status.
- Open risks.
- Candidate backlog items.

## Files To Read First

- `AGENTS.md`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_SPRINT.md`
- `docs/DECISION_LOG.md`
- `docs/RISK_REGISTER.md`
- `docs/BACKLOG.md`
- `docs/BETA_STATUS.md`
- `docs/WORKLOG.md`
- `superpowers/skills/roadmap-update.md`
- `superpowers/skills/competitor-differentiation.md`
- `superpowers/agents/entrepreneur.md`
- `superpowers/agents/developer.md`
- `superpowers/agents/qa-reviewer.md`

## Agents To Invoke

- Entrepreneur
- Developer
- QA Reviewer
- Retention Analyst when beta evidence exists
- Privacy Officer when trust or data risks affect priorities
- Beta Operator when operations affect roadmap

## Skills/Workflows To Invoke

- `superpowers/skills/roadmap-update.md`
- `superpowers/skills/competitor-differentiation.md`
- `superpowers/skills/retention-review.md` when beta evidence exists
- `superpowers/skills/cost-risk-review.md` when roadmap items could add cost

## Output Format

```md
## Roadmap Update Result

Current Decision:
- ...

Next Sprint Focus:
- ...

Backlog Changes:
- Added:
- Deferred:
- Removed:

Risks:
- ...

Next 1-3 Tasks:
- ...
```

## Files To Update

- `docs/PROJECT_STATE.md`.
- `docs/CURRENT_SPRINT.md`.
- `docs/DECISION_LOG.md`.
- `docs/RISK_REGISTER.md`.
- `docs/BACKLOG.md`.
- `docs/BETA_STATUS.md`.
- `docs/WORKLOG.md`.

## Stop Conditions

- Roadmap update is based only on preference and no evidence.
- The update expands beyond MVP without feature meeting and decision record.
- The update adds paid-service, schema, or dependency requirements without approval.

## Acceptance Criteria

- Updates roadmap, backlog, and current sprint based on decisions and test results.
- Preserves MVP focus.
- Separates now, next, later, and removed.
- Carries forward risks explicitly.
