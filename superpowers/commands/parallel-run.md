# Parallel Run Command

## Purpose

Run one approved parallel workstream lane according to its `parallel-task` spec.

## When To Run

- After `parallel-plan.md` has created lane specs.
- When the current session is assigned one lane.
- When the lane can complete without touching forbidden files.

## Required Input

- Path to the lane's `parallel-task` spec.
- Parent task or ticket.
- Current lane name.
- Any dependency status.

## How To Split Work

Do not split further unless the lane spec explicitly allows sub-lanes. Stay inside the lane's allowed files and goal.

## How To Prevent Conflicts

- Read the lane spec before touching files.
- Touch only allowed files.
- Do not touch forbidden files.
- If a needed file is not listed as allowed, stop and ask for merge-gate or plan update.
- Do not alter another lane's scope.
- If changing code, run lint, typecheck, and build when dependencies are available.

## How To Merge Results

- Produce a lane report using `superpowers/templates/parallel-lane-report.md`.
- Include changed files, verification, open risks, and merge notes.
- Do not merge lane results directly into final readiness without `parallel-merge-review.md`.

## Files To Read First

- `AGENTS.md`
- `docs/PROJECT_STATE.md`
- `docs/CURRENT_SPRINT.md`
- `docs/RISK_REGISTER.md`
- Assigned `parallel-task` file
- Parent ticket or decision record
- Relevant agent files for the lane

## Output Format

```md
## Parallel Lane Result

Lane:
- ...

Goal:
- ...

Changed Files:
- ...

Verification:
- ...

Blocked:
- Yes / No

Merge Notes:
- ...
```

## Stop Conditions

- No lane spec is provided.
- The lane requires forbidden files.
- The lane discovers a dependency on another lane that is not complete.
- The lane requires DB schema, RLS, auth, middleware, or package changes not approved for this lane.
- The lane drifts beyond the parent ticket.

## Acceptance Criteria

- Completes only assigned lane scope.
- Produces a lane report.
- Does not touch unapproved files.
- Reports conflicts immediately.
- Runs verification if code changed.
