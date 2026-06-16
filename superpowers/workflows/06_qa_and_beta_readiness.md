# Workflow 06: QA And Beta Readiness

## Trigger

Before inviting beta users, after deployment changes, or after any implementation affecting the main user loop.

## Goal

Confirm Donghaeng Room is ready for a small public beta smoke test.

## Required Input

- Target URL.
- Available test accounts.
- Environment variable status.
- Supabase Auth redirect status.
- Known limitations.

## Agents To Call

- QA Reviewer
- Developer
- Security Reviewer
- Designer

## Skills To Use

- qa-check
- beta-test-plan

## Step-By-Step Process

1. Confirm whether the target is local or public Vercel.
2. Run lint, typecheck, and build when dependencies are available.
3. Test signup, email confirmation, login, and profile creation.
4. Test leader group creation and invite message.
5. Test second-user invite-code join.
6. Test check-in save and status update.
7. Test prayer request save, card display, and "기도했어요".
8. Test leader dashboard.
9. Spot-check privacy and visibility behavior.
10. Decide ready, not ready, or blocked.

## Decision Gate

External beta is allowed only if the public URL supports signup/login, leader invite, member join, check-in, prayer card, "기도했어요", and leader dashboard without critical blockers.

## Files To Update

- A filled copy of `superpowers/templates/qa-report.md`.
- `docs/PROJECT_STATUS.md`.
- `MAC_MINI_HANDOFF.md` if cross-machine setup or deployment status changes.

## Final Output Format

```md
## QA And Beta Readiness

Target:
- ...

Checks:
- ...

Blockers:
- ...

Decision:
- Ready for 1-leader beta / Not ready / Blocked

Next Step:
- ...
```
