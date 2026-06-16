# Donghaeng Room Reality Checklist

This checklist adds real-world review layers for the existing MVP. It does not expand product scope or authorize new features.

Use it with:

- `superpowers/workflows/08_pre_beta_readiness_audit.md`
- `superpowers/workflows/09_post_beta_learning_loop.md`
- `docs/BETA_TEST_GUIDE.md`
- `docs/PRIVACY_RULES.md`

## 1. Privacy And Sensitive Data

- [ ] Are prayer requests potentially sensitive?
- [ ] Are check-ins, moods, and notes potentially sensitive?
- [ ] Is visibility clear before submission?
- [ ] Can users edit or delete their own content, or is the limitation known?
- [ ] Can private data leak through leader dashboards?
- [ ] Can private data leak through invite links or query strings?
- [ ] Can private data leak through user-facing errors?
- [ ] Is RLS required for this feature?
- [ ] Are anonymous prayers actually anonymous in UI?
- [ ] Are feedback forms avoiding collection of real prayer content?

## 2. Beta Test Operations

- [ ] Can one real leader create a room without help?
- [ ] Can the leader invite 2 members?
- [ ] Can a member join and check in within 2 minutes?
- [ ] Is there a copy-ready invite message?
- [ ] Is there a beta feedback form or guide?
- [ ] Is there a plan to delete beta data if requested?
- [ ] Is there a known support contact for beta issues?
- [ ] Is the beta being run from the public Vercel URL, not localhost?

## 3. Retention And Weekly Reuse

- [ ] Why would a leader return next week?
- [ ] Why would a member check in more than once?
- [ ] Which screen creates repeated value?
- [ ] What is the first-week aha moment?
- [ ] What is the likely drop-off point?
- [ ] Is repeated value tied to prayer memory and leader care, not pressure?
- [ ] Are we avoiding rankings, streaks, guilt, and surveillance language?

## 4. Cost Escalation

- [ ] Does this feature add realtime risk?
- [ ] Does this feature add storage or file upload risk?
- [ ] Does this feature add AI or paid API risk?
- [ ] Does this feature add push, SMS, or Kakao API risk?
- [ ] Can this be solved with static UI, server actions, and existing Supabase tables?
- [ ] Is the feature safe for free-tier MVP?
- [ ] Does it add support or moderation workload?

## 5. Onboarding Friction

- [ ] Can the leader understand the first action?
- [ ] Can the member understand the first action?
- [ ] Is email confirmation a blocker?
- [ ] Is profile setup clear?
- [ ] Is the leader path clearly separate from the member path?
- [ ] Is the invite code visible and copyable?
- [ ] Does the first check-in feel possible in about 20 seconds?

## 6. Deletion And Membership Edge Cases

- [ ] What happens if a user wants their beta data deleted?
- [ ] What happens if a member joins the same group twice?
- [ ] What happens if a member leaves or is removed later?
- [ ] What happens if a leader leaves?
- [ ] Can old private content remain visible to unintended users?
- [ ] Are deletion limitations documented before beta?
- [ ] Is there a manual operator plan if deletion UI does not exist yet?

## Decision Rule

Do not invite external beta users if there is a critical privacy leak, no public URL smoke test, no invite path, no feedback path, or no data deletion handling plan.
