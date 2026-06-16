# Beta Readiness Review Skill

## Purpose

Decide whether Donghaeng Room is operationally ready for a first real leader beta.

## When To Use

- Before sending a public beta link to a leader.
- After deployment, auth, invite, check-in, prayer, or dashboard stabilization.
- When moving from internal smoke test to real beta.

## Inputs Required

- Public beta URL.
- Supabase Auth redirect configuration status.
- Test leader and member accounts or plan.
- Invite message and feedback forms.
- Known blockers or limitations.
- Data deletion handling plan.

## Step-By-Step Process

1. Confirm the target is a public URL, not localhost.
2. Confirm one leader can sign up, confirm email, log in, create profile, and create a room.
3. Confirm the leader can invite 2 members with copy-ready text/code.
4. Confirm a member can join and check in within 2 minutes.
5. Confirm prayer request card and "기도했어요" loops.
6. Confirm leader dashboard is understandable and care-oriented.
7. Confirm beta feedback guide or form exists.
8. Confirm deletion request handling is documented.
9. Decide ready, not ready, or blocked.

## Output Format

```md
## Beta Readiness Review

Target:
- ...

Operational Checks:
- ...

Privacy Checks:
- ...

Runbook:
- ...

Decision:
- Ready for first leader beta / Not ready / Blocked
```

## Acceptance Criteria

- Uses public beta URL for readiness.
- Checks leader and member flows.
- Includes invite, feedback, and deletion plan.
- Keeps beta small until one leader completes the loop.
