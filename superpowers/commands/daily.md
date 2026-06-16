# Daily Planning Command

## Purpose

Run a structured start-of-day planning loop for Donghaeng Room and choose the top 3 tasks for the current work session.

## When To Run

- At the beginning of a work session.
- After switching machines.
- After a beta test, code review, or QA result changes project priorities.
- When the user asks what to do next.

## Required Inputs

- Current goal or blocker.
- Available time for the session.
- Any new beta feedback, QA result, or deployment status.

## Files To Read First

- `AGENTS.md`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_SPRINT.md`
- `docs/RISK_REGISTER.md`
- `docs/BACKLOG.md`
- `docs/BETA_STATUS.md`
- `docs/WORKLOG.md`
- `superpowers/workflows/01_daily_planning.md`
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

## Skills/Workflows To Invoke

- `superpowers/workflows/01_daily_planning.md`
- `superpowers/skills/product-plan.md`
- `superpowers/skills/roadmap-update.md`
- `superpowers/skills/cost-risk-review.md` when scope or infrastructure might change

## Output Format

```md
## Daily Planning Result

Project Readiness:
- ...

Expert Feedback:
- Developer:
- Entrepreneur:
- Designer:
- Marketer:
- Security Reviewer:
- QA Reviewer:

Top 3 Tasks Today:
1. ...
2. ...
3. ...

Do Not Do Today:
- ...

Files To Update:
- ...
```

## Files To Update

- `docs/WORKLOG.md` when the plan creates a useful session note.
- `docs/CURRENT_SPRINT.md` when sprint focus changes.
- `docs/BACKLOG.md` when a task is added, deferred, or removed.
- `docs/RISK_REGISTER.md` when a new blocker or risk is identified.

## Stop Conditions

- The requested task is app implementation without an approved ticket.
- The plan requires new dependencies, database schema changes, or paid services without explicit approval.
- The plan drifts toward chat, BAND-style board, Bible app, AI devotional app, or church ERP scope.

## Acceptance Criteria

- Reads current state before choosing tasks.
- Gives expert feedback from all six required agents.
- Chooses exactly top 3 tasks.
- Lists what not to do today.
- Keeps MVP focused on check-in, prayer memory, and leader care.
