# Workflow 10: Parallel Workstream Planning

## Trigger

A large approved task needs to be split into independent lanes.

## Goal

Create safe parallel workstream specs with clear file boundaries and a required merge gate.

## Required Input

- Parent task, decision record, or implementation ticket.
- Desired lanes.
- Known file areas.
- Current risks and dependencies.

## Default Lanes

### Lane A: Backend/Security

- auth callback safety
- server action error handling
- Supabase/RLS review
- no UI copy changes unless necessary

### Lane B: UX/Onboarding

- no-group screen
- leader/member path clarity
- mobile UI
- no DB/auth logic changes

### Lane C: Marketing/Beta Copy

- invite message
- beta guide
- onboarding copy
- no app logic changes

### Lane D: QA/Pre-Beta

- manual test checklist
- privacy test cases
- beta readiness audit
- no implementation changes

### Lane E: Docs/Roadmap

- update state files
- decision logs
- backlog
- no app code changes

## Step-By-Step Process

1. Confirm the parent task is approved.
2. Identify independent work areas.
3. Assign each area to a lane.
4. Declare allowed files and forbidden files per lane.
5. Identify dependencies between lanes.
6. Identify merge risks.
7. Decide which lanes can run in parallel and which must stay sequential.
8. Create a `parallel-task` spec for each lane.
9. Require `parallel-merge-review.md` before final merge.

## Decision Gate

Parallel work is allowed only when tasks touch clearly separated files. If file overlap, DB/RLS/auth/middleware/package changes, or privacy risk cannot be isolated, keep the work sequential.

## Files To Update

- Lane specs based on `superpowers/templates/parallel-task.md`.
- `docs/WORKLOG.md` if the workstream plan becomes the session plan.
- `docs/RISK_REGISTER.md` if new merge or security risks are found.

## Final Output Format

```md
## Parallel Workstream Plan

Parallel Lanes:
- ...

Sequential Lanes:
- ...

File Boundaries:
- ...

Merge Gate Required:
- Yes / No

Risks:
- ...
```
