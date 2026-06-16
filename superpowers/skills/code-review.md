# Code Review Skill

## Purpose

Review implementation changes for bugs, regressions, privacy risk, and missing verification.

## When To Use

- After implementation and before merge or deployment.
- When reviewing changes from another machine or prior session.
- When the user asks for a review.

## Inputs Required

- Diff or changed file list.
- Feature brief or ticket.
- Test results.
- Known constraints or unresolved questions.

## Step-By-Step Process

1. Inspect changed files and compare against the approved scope.
2. Prioritize findings by severity.
3. Check auth, RLS, visibility, invite, and sensitive-data behavior when touched.
4. Check mobile UX and Korean care-language implications when UI is touched.
5. Check whether tests or manual QA are adequate for the risk.
6. Recommend fix, approve, or block.

## Output Format

```md
## Code Review

Findings:
- [P1/P2/P3] File:line - issue

Open Questions:
- ...

Verification Gaps:
- ...

Decision:
- Approve / Approve after fixes / Block
```

## Acceptance Criteria

- Findings come before summary.
- Uses file and line references when possible.
- Calls out missing verification.
- Confirms no MVP drift or names the drift clearly.
