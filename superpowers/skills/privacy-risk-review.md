# Privacy Risk Review Skill

## Purpose

Review Donghaeng Room features and beta operations for sensitive prayer, check-in, visibility, deletion, and membership risks.

## When To Use

- Before beta testing.
- Before changing auth, groups, check-ins, prayers, reactions, visibility, dashboards, or invite links.
- When handling deletion, group membership, anonymous prayer, or beta feedback collection.

## Inputs Required

- Feature or workflow being reviewed.
- Data touched: profiles, groups, memberships, check-ins, prayers, reactions, invite codes, feedback forms.
- Visibility options shown to users.
- Current RLS or server-side enforcement assumptions.
- Known deletion/edit limitations.

## Step-By-Step Process

1. Identify sensitive data in the flow.
2. Confirm whether visibility is clear before submission.
3. Check whether privacy is enforced by RLS or server-side checks, not just UI.
4. Check for leaks through dashboards, invite links, URLs, logs, and error messages.
5. Check anonymous prayer display and joined profile behavior.
6. Check edit/delete expectations and current limitations.
7. Check group membership edge cases: joining twice, leaving, removed members, leaders viewing old data.
8. Recommend pass, pass with safeguards, or block.

## Output Format

```md
## Privacy Risk Review

Decision:
- Pass / Pass with safeguards / Block

Sensitive Data:
- ...

Visibility Review:
- ...

Leak Paths:
- ...

Deletion And Membership Edge Cases:
- ...

Required Safeguards:
- ...
```

## Acceptance Criteria

- Explicitly checks prayer and check-in sensitivity.
- Mentions whether RLS is required or already expected.
- Covers anonymous prayer UI.
- Covers edit/delete and group membership edge cases.
- Blocks beta if private data can leak.
