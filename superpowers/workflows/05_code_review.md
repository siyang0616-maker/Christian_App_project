# Workflow 05: Code Review

## Trigger

After implementation, before commit, before deployment, or when reviewing previous work.

## Goal

Find bugs, regressions, privacy risks, and verification gaps before beta users encounter them.

## Required Input

- Diff or changed file list.
- Approved brief or implementation ticket.
- Verification results.
- Known unresolved issues.

## Agents To Call

- Developer
- Security Reviewer when data, auth, visibility, or membership is touched
- Designer when UI or copy is touched
- QA Reviewer

## Skills To Use

- code-review
- qa-check
- competitor-differentiation if feature scope drift is suspected

## Step-By-Step Process

1. Inspect repository status and changed files.
2. Compare changes against the approved scope.
3. Review for behavioral regressions and privacy risks.
4. Review mobile UX and care-language changes if UI changed.
5. Review verification results.
6. List findings by severity with file references.
7. Decide approve, approve after fixes, or block.

## Decision Gate

Do not approve if the change leaks private prayer/check-in data, breaks auth/invite/check-in/prayer flows, adds unapproved dependencies, or broadens MVP scope.

## Files To Update

- A filled copy of `superpowers/templates/qa-report.md` if review creates QA follow-up.
- `docs/PROJECT_STATUS.md` if readiness status changes.

## Final Output Format

```md
## Code Review Result

Findings:
- ...

Verification Gaps:
- ...

Decision:
- Approve / Approve after fixes / Block

Next Required Action:
- ...
```
