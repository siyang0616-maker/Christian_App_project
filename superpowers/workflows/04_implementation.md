# Workflow 04: Implementation

## Trigger

An implementation ticket has been approved through feature meeting.

## Goal

Make a small, bounded change that matches the approved ticket and preserves MVP constraints.

## Required Input

- Approved implementation ticket.
- Current repository status.
- Files likely to change.
- Verification plan.

## Agents To Call

- Developer
- Security Reviewer when auth, data, visibility, group membership, or prayer/check-in content is touched
- Designer when UI or copy is touched

## Skills To Use

- implementation-plan
- qa-check for verification planning

## Step-By-Step Process

1. Confirm the working tree status.
2. Read the approved ticket and acceptance criteria.
3. Inspect affected files.
4. Make the smallest code or documentation change required.
5. Avoid unrelated refactors.
6. Run verification commands when dependencies are available.
7. Record manual QA steps for anything not covered by automated checks.

## Decision Gate

Stop implementation if the work requires unapproved app features, database schema changes, dependencies, or broader product scope.

## Files To Update

- Only files named in the approved ticket, unless a directly required supporting file is discovered.
- `docs/PROJECT_STATUS.md` or a QA report if the task changes readiness status.

## Final Output Format

```md
## Implementation Result

Changed:
- ...

Verification:
- ...

Not Changed:
- No new dependencies
- No unapproved features
- No unrelated refactors

Follow-Up:
- ...
```
