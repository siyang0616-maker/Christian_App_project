# Parallel Plan Command

## Purpose

Split a large approved task into independent parallel workstream lanes while protecting Donghaeng Room from file conflicts, scope creep, privacy regressions, and competitor drift.

## When To Run

- Before a task is divided across multiple agents, sessions, or workstreams.
- When the work can be separated by file ownership.
- Before MVP stabilization work that has backend/security, UX, beta copy, QA, and docs pieces.

## Required Input

- Parent task or approved implementation ticket.
- Desired lanes.
- Current constraints.
- Known files likely to change.
- Any required sequencing.

## How To Split Work

Use these default lanes:

- Lane A: Backend/Security
  - auth callback safety
  - server action error handling
  - Supabase/RLS review
  - no UI copy changes unless necessary
- Lane B: UX/Onboarding
  - no-group screen
  - leader/member path clarity
  - mobile UI
  - no DB/auth logic changes
- Lane C: Marketing/Beta Copy
  - invite message
  - beta guide
  - onboarding copy
  - no app logic changes
- Lane D: QA/Pre-Beta
  - manual test checklist
  - privacy test cases
  - beta readiness audit
  - no implementation changes
- Lane E: Docs/Roadmap
  - update state files
  - decision logs
  - backlog
  - no app code changes

Each lane must declare:

- lane name
- goal
- allowed files
- forbidden files
- dependencies
- acceptance criteria
- merge risk

## How To Prevent Conflicts

- Do not assign the same file to two lanes unless explicitly approved.
- Keep DB schema, RLS, auth, middleware, and `package.json` changes sequential unless a merge gate is required and approved.
- Make docs-only lanes touch only docs and Superpowers files.
- Make QA lanes produce reports/checklists, not code changes.
- Freeze parent scope before running lanes.

## How To Merge Results

1. Collect lane reports using `superpowers/templates/parallel-lane-report.md`.
2. Compare changed files across lanes.
3. Run `superpowers/commands/parallel-merge-review.md`.
4. Stop if conflicts, duplicated work, security risk, or scope creep exists.
5. Only after merge gate approval should code review or QA proceed.

## Files To Read First

- `AGENTS.md`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_SPRINT.md`
- `docs/RISK_REGISTER.md`
- Parent decision record or implementation ticket
- `superpowers/workflows/10_parallel_workstream_planning.md`
- `superpowers/templates/parallel-task.md`
- `superpowers/templates/parallel-lane-report.md`

## Output Format

```md
## Parallel Plan

Parent Task:
- ...

Approved Lanes:
- Lane A:
- Lane B:
- Lane C:
- Lane D:
- Lane E:

Sequential Work:
- ...

Conflict Rules:
- ...

Merge Gate:
- Required / Not required
```

## Stop Conditions

- The parent task has no approved decision or ticket.
- Two lanes need the same file and no explicit conflict approval exists.
- The task requires DB schema, RLS, auth, middleware, or package changes that cannot be isolated.
- The split would hide security, privacy, or scope decisions inside a lane.

## Acceptance Criteria

- Produces one `parallel-task` spec per approved lane.
- Every lane has allowed and forbidden files.
- No overlapping file writes unless explicitly approved.
- Merge gate requirements are clear.
