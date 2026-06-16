# QA Check Skill

## Purpose

Run or plan release-readiness checks for Donghaeng Room.

## When To Use

- Before public beta.
- After implementation.
- After deployment or environment changes.
- When verifying signup, invite, check-in, prayer, and leader dashboard loops.

## Inputs Required

- Target environment: local, Vercel production, or preview.
- Test accounts available.
- Supabase and Vercel configuration status.
- Feature or flow to verify.

## Step-By-Step Process

1. Identify the environment and URL.
2. Confirm local dependencies and environment variables if testing locally.
3. Run lint, typecheck, and build when dependencies are available.
4. Test auth and email confirmation.
5. Test leader creates room and invite message.
6. Test member joins with invite code.
7. Test check-in save and visible update.
8. Test prayer request save and "기도했어요" reaction.
9. Test leader dashboard.
10. Record blockers, bugs, and residual risks.

## Output Format

```md
## QA Check

Environment:
- ...

Checks:
- Pass / Fail / Blocked - ...

Findings:
- ...

Release Decision:
- Ready / Not ready / Blocked
```

## Acceptance Criteria

- Distinguishes local from public beta readiness.
- Includes the full leader/member loop.
- Records blocked checks honestly.
- Does not expand feature scope.
