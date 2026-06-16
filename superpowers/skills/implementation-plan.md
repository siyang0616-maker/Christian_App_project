# Implementation Plan Skill

## Purpose

Convert an approved feature brief into a small, verifiable engineering plan.

## When To Use

- After a feature meeting approves implementation.
- Before editing app code.
- Before touching database, auth, or privacy-sensitive flows.

## Inputs Required

- Approved feature brief or implementation ticket.
- Current files likely affected.
- Acceptance criteria.
- Verification expectations.

## Step-By-Step Process

1. Confirm the approved scope.
2. List files likely to change.
3. Identify any files that must not change.
4. Break the implementation into small steps.
5. Name privacy, RLS, or cross-platform risks.
6. Define verification: lint, typecheck, build, browser/manual smoke test.
7. Stop if scope has drifted beyond the approved brief.

## Output Format

```md
## Implementation Plan

Approved Scope:
- ...

Files To Touch:
- ...

Files Not To Touch:
- ...

Steps:
- ...

Verification:
- ...

Stop Conditions:
- ...
```

## Acceptance Criteria

- Has a bounded file list.
- Includes verification steps.
- Does not include unapproved features.
- Protects app privacy, cost, and mobile-first constraints.
