# Retrospective Command

## Purpose

Summarize what worked, what failed, and what should change after testing or a development cycle.

## When To Run

- After QA.
- After a beta test or attempted beta test.
- After implementing a ticket.
- At the end of a work session or sprint.

## Required Inputs

- Work completed.
- Tests run.
- Issues found.
- User or beta feedback.
- Open risks.

## Files To Read First

- `AGENTS.md`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_SPRINT.md`
- `docs/RISK_REGISTER.md`
- `docs/WORKLOG.md`
- `docs/BETA_STATUS.md`
- `docs/POST_BETA_REVIEW.md`
- `superpowers/workflows/09_post_beta_learning_loop.md` when beta evidence exists
- `superpowers/skills/retention-review.md`
- `superpowers/skills/roadmap-update.md`

## Agents To Invoke

- Retention Analyst when beta or repeated use is involved
- Beta Operator when operations were tested
- QA Reviewer
- Developer
- Entrepreneur
- Privacy Officer when trust or sensitive data issues appeared

## Skills/Workflows To Invoke

- `superpowers/workflows/09_post_beta_learning_loop.md` when beta evidence exists
- `superpowers/skills/retention-review.md`
- `superpowers/skills/privacy-risk-review.md` when sensitive issues appeared
- `superpowers/skills/roadmap-update.md`

## Output Format

```md
## Retrospective Result

What Worked:
- ...

What Failed:
- ...

What To Change:
- ...

Risks To Carry Forward:
- ...

Next 1-3 Actions:
- ...
```

## Files To Update

- `docs/WORKLOG.md`.
- `docs/RISK_REGISTER.md`.
- `docs/BACKLOG.md`.
- `docs/CURRENT_SPRINT.md` when sprint focus changes.
- `docs/BETA_STATUS.md` when beta evidence changes readiness.

## Stop Conditions

- There is no completed work, test result, or feedback to review.
- The retrospective tries to add roadmap scope without evidence.
- The next action requires implementation without a feature meeting or ticket.

## Acceptance Criteria

- Runs after testing or a development cycle.
- Summarizes what worked, what failed, and what to change.
- Produces evidence-based next actions.
- Updates state files when useful.
