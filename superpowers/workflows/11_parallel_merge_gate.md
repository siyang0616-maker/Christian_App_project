# Workflow 11: Parallel Merge Gate

## Trigger

Two or more parallel lanes are complete and their outputs need to be combined.

## Goal

Prevent conflicts, duplicated work, security regression, scope creep, and competitor drift before merging lane outputs.

## Required Input

- Parent task or ticket.
- All parallel lane reports.
- Changed file list by lane.
- Verification results by lane.
- Known blockers.

## Step-By-Step Process

1. Read parent scope and lane specs.
2. Read every lane report.
3. Compare changed files by lane.
4. Identify direct file conflicts.
5. Identify duplicated work and inconsistent decisions.
6. Check whether DB schema, RLS, auth, middleware, or package changes were parallelized.
7. Review security and privacy risk.
8. Review competitor drift.
9. Check verification results.
10. Decide merge approved, merge after fixes, or stop for manual decision.

## Decision Gate

If conflicts exist, stop and ask for a manual decision. Do not auto-resolve file overlap, scope disagreement, or security tradeoffs.

## Files To Update

- A merge review report based on `superpowers/templates/merge-review-report.md`.
- `docs/RISK_REGISTER.md` when unresolved risks remain.
- `docs/WORKLOG.md` when the merge decision changes the session status.

## Final Output Format

```md
## Parallel Merge Gate

Decision:
- Merge approved / Merge after fixes / Stop for manual decision

Conflicts:
- ...

Security/Privacy:
- ...

Scope:
- ...

Competitor Drift:
- ...

Required Fixes:
- ...
```
