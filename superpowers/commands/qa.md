# QA Review Command

## Purpose

Produce and run a structured QA review for Donghaeng Room's MVP loop.

## When To Run

- After implementation.
- Before public beta.
- After deployment or environment changes.
- When the user asks whether the app is ready to test.

## Required Inputs

- Target environment: local, Vercel production, or preview.
- Target URL.
- Test accounts or account creation plan.
- Known limitations.

## Files To Read First

- `AGENTS.md`
- `docs/PROJECT_STATE.md`
- `docs/BETA_STATUS.md`
- `docs/RISK_REGISTER.md`
- `docs/PRE_BETA_AUDIT.md`
- `docs/REALITY_CHECKLIST.md`
- `superpowers/workflows/06_qa_and_beta_readiness.md`
- `superpowers/skills/qa-check.md`
- `superpowers/agents/qa-reviewer.md`
- `superpowers/agents/security-reviewer.md`
- `superpowers/agents/developer.md`

## Agents To Invoke

- QA Reviewer
- Developer
- Security Reviewer
- Privacy Officer
- Designer for mobile and copy checks

## Skills/Workflows To Invoke

- `superpowers/workflows/06_qa_and_beta_readiness.md`
- `superpowers/skills/qa-check.md`
- `superpowers/skills/privacy-risk-review.md`
- `superpowers/skills/beta-readiness-review.md`

## Output Format

```md
## QA Review Result

Target:
- ...

Blocking Issues:
- ...

Non-Blocking Issues:
- ...

Manual QA Checklist:
- ...

Decision:
- Pass / Not ready / Blocked
```

## Files To Update

- `docs/BETA_STATUS.md` when readiness changes.
- `docs/RISK_REGISTER.md` when blockers are found.
- `docs/WORKLOG.md` with QA summary.
- A QA report under `superpowers/reports/` if a durable artifact is needed.

## Stop Conditions

- Public beta flow cannot be tested on a public URL when public readiness is requested.
- Private data leak is found.
- Signup, invite, check-in, prayer, or leader dashboard loop is broken.
- Missing environment or dependencies prevent meaningful QA.

## Acceptance Criteria

- Produces manual QA checklist.
- Tests auth, group creation, invite, check-in, prayer, privacy, and leader dashboard.
- Separates blocking from non-blocking issues.
- Does not implement fixes during QA unless separately requested.
