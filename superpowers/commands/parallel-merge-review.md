# Parallel Merge Review Command

## Purpose

Review parallel lane outputs before combining them into a final implementation, QA result, roadmap update, or beta readiness decision.

## When To Run

- After two or more parallel lanes complete.
- Before code review, QA, commit, deployment, or beta readiness decision.
- Whenever lanes touched adjacent files or related user flows.

## Required Input

- Parent task or ticket.
- All lane reports.
- Changed file list per lane.
- Verification results per lane.
- Known conflicts or blocked items.

## How To Split Work

This command does not split work. It reviews whether the split remained safe.

## How To Prevent Conflicts

- Compare changed files across all lanes.
- Flag duplicated work.
- Flag unapproved file overlap.
- Flag scope creep.
- Flag privacy or auth changes that bypassed Backend/Security review.
- Flag competitor drift into chat, board/feed, Bible content, AI devotional content, or church ERP.

## How To Merge Results

1. List all lane outputs.
2. Check file conflicts.
3. Check acceptance criteria per lane.
4. Check verification results.
5. Check security, privacy, cost, and competitor drift.
6. Decide merge approved, merge after fixes, or stop for manual decision.

## Files To Read First

- `AGENTS.md`
- `docs/RISK_REGISTER.md`
- Parent decision record or ticket
- All lane reports
- `superpowers/workflows/11_parallel_merge_gate.md`
- `superpowers/templates/merge-review-report.md`
- `superpowers/agents/developer.md`
- `superpowers/agents/security-reviewer.md`
- `superpowers/agents/qa-reviewer.md`
- `superpowers/agents/entrepreneur.md`

## Output Format

```md
## Parallel Merge Review

Decision:
- Merge approved / Merge after fixes / Stop for manual decision

Lane Summary:
- ...

Conflicts:
- ...

Duplicated Work:
- ...

Scope Creep:
- ...

Security And Privacy Risk:
- ...

Competitor Drift:
- ...

Required Fixes:
- ...
```

## Stop Conditions

- Any lane modified a forbidden file.
- Two lanes changed the same file without explicit approval.
- Auth, RLS, middleware, DB schema, or package changes were parallelized without a merge gate.
- Security, privacy, or competitor drift risk is unresolved.
- Conflicts exist and require human prioritization.

## Acceptance Criteria

- Reviews conflicts, duplicated work, scope creep, security risk, and competitor drift.
- Stops when manual decision is needed.
- Produces a merge review report.
- Does not hide unresolved lane conflicts.
