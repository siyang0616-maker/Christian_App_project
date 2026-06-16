# Roadmap Update Skill

## Purpose

Update roadmap priorities using beta evidence and MVP constraints.

## When To Use

- After QA review, beta feedback, or product decisions.
- When deciding next iteration priorities.
- When updating `docs/PROJECT_STATUS.md`, `docs/MVP_SCOPE.md`, or decision records.

## Inputs Required

- Current status.
- Evidence gathered.
- Known blockers.
- Candidate next tasks.
- Existing roadmap or docs to update.

## Step-By-Step Process

1. Summarize evidence.
2. Separate must-fix stabilization from feature expansion.
3. Rank tasks by leader reuse impact.
4. Defer tasks that imitate comparison products or add cost/scope.
5. Pick the next 1-3 tasks.
6. Update docs or create a decision record as needed.

## Output Format

```md
## Roadmap Update

Evidence:
- ...

Must Fix:
- ...

Next 1-3 Tasks:
- ...

Deferred:
- ...

Docs To Update:
- ...
```

## Acceptance Criteria

- Prioritizes stabilization before expansion.
- Names evidence behind each priority.
- Keeps roadmap tied to check-in, prayer memory, and leader care.
- Avoids broad feature lists.
