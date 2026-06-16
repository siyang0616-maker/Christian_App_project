# Pre-Beta Audit Command

## Purpose

Decide whether Donghaeng Room is ready for a real beta with 1 leader and 2 members.

## When To Run

- Before inviting the first real leader.
- After QA passes locally.
- After deployment or Supabase Auth settings change.
- Before sharing the public beta link outside the builder team.

## Required Inputs

- Public beta URL.
- Supabase Auth redirect status.
- Current known blockers.
- Test account plan.
- Feedback collection method.
- Data deletion request plan.

## Files To Read First

- `AGENTS.md`
- `docs/PROJECT_STATE.md`
- `docs/BETA_STATUS.md`
- `docs/RISK_REGISTER.md`
- `docs/PRE_BETA_AUDIT.md`
- `docs/REALITY_CHECKLIST.md`
- `docs/BETA_TEST_GUIDE.md`
- `superpowers/workflows/08_pre_beta_readiness_audit.md`
- `superpowers/skills/beta-readiness-review.md`
- `superpowers/skills/privacy-risk-review.md`
- `superpowers/skills/retention-review.md`
- `superpowers/skills/cost-risk-review.md`

## Agents To Invoke

- Privacy Officer
- Beta Operator
- Retention Analyst
- QA Reviewer
- Developer
- Designer
- Security Reviewer

## Skills/Workflows To Invoke

- `superpowers/workflows/08_pre_beta_readiness_audit.md`
- `superpowers/skills/beta-readiness-review.md`
- `superpowers/skills/privacy-risk-review.md`
- `superpowers/skills/retention-review.md`
- `superpowers/skills/cost-risk-review.md`
- `superpowers/skills/competitor-differentiation.md`

## Output Format

```md
## Pre-Beta Audit Result

Decision:
- Ready / Not ready

Blocking Issues:
- ...

Non-Blocking Issues:
- ...

Top 3 Fixes Before Beta:
1. ...
2. ...
3. ...

Manual Test Checklist:
- ...
```

## Files To Update

- `docs/BETA_STATUS.md`.
- `docs/RISK_REGISTER.md`.
- `docs/WORKLOG.md`.
- `docs/BACKLOG.md` for required fixes.
- `superpowers/templates/privacy-risk-report.md` copy if a durable privacy report is needed.
- `superpowers/templates/beta-test-runbook.md` copy if a runbook is needed.

## Stop Conditions

- Public URL is missing or unverified.
- No beta feedback guide exists.
- No data deletion plan exists.
- Critical privacy leak or anonymous prayer leak is found.
- The test requires new paid services or feature expansion.

## Acceptance Criteria

- Decides Ready or Not ready.
- Checks onboarding, invite flow, privacy, error handling, cost risk, and competitor drift.
- Confirms whether 1 leader and 2 members can complete the beta loop.
- Produces top 3 fixes and manual test checklist.
