# Workflow 01: Daily Planning

## Trigger

Start of a work session, machine switch, or "what should I do next?" moment.

## Goal

Choose the smallest useful next action for Donghaeng Room without drifting beyond MVP stabilization.

## Required Input

- Current repository status or latest handoff.
- Current blocker or goal.
- Target environment: local, Vercel production, or beta test.
- Available time for the session.

## Agents To Call

- Entrepreneur
- Developer
- QA Reviewer

## Skills To Use

- product-plan
- roadmap-update
- qa-check if beta readiness is involved

## Step-By-Step Process

1. Read `AGENTS.md`, `docs/PROJECT_STATUS.md`, and `MAC_MINI_HANDOFF.md` if present.
2. Check repository status and identify uncommitted work.
3. Separate stabilization tasks from feature expansion.
4. Rank possible tasks by leader reuse impact.
5. Pick one primary task and one backup task.
6. Define the verification needed for the primary task.
7. Record any doc updates needed after the session.

## Decision Gate

Proceed only if the selected task strengthens check-in, prayer memory, leader care, or beta readiness. Defer anything that mainly adds chat, feed, Bible content, devotional media, payment, native app, push, file upload, or ERP scope.

## Files To Update

- `docs/PROJECT_STATUS.md` when status changes.
- `MAC_MINI_HANDOFF.md` when cross-machine handoff changes.
- A decision record from `superpowers/templates/decision-record.md` when roadmap scope changes.

## Final Output Format

```md
## Daily Plan

Primary Task:
- ...

Why This Matters:
- ...

Steps:
- ...

Verification:
- ...

Do Not Touch:
- ...
```
