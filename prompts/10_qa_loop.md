# 10 QA Loop

Copy and paste this prompt into Codex when you want a final QA pass before GitHub, Supabase testing, or Vercel deployment.

## Prompt

You are Codex running a QA loop for Donghaeng Room / 동행방.

QA goals:

- Confirm the MVP is safe enough for beta testing.
- Confirm the app still matches the product scope.
- Confirm GitHub does not include secrets or generated build artifacts.
- Confirm basic build checks pass.

Run this QA loop:

## 1. Scope QA

Check whether the app still avoids:

- Full chat
- AI features
- Payment
- Bible content database
- File uploads
- Push notifications
- Native app assumptions
- Church-wide admin features
- Ranking, scoring, or guilt-based gamification

## 2. Privacy QA

Check:

- `.env.local` is ignored.
- No service_role key is present in source files.
- Supabase RLS policies exist for sensitive tables.
- Private, leader-only, group, and anonymous visibility rules are respected.
- Anonymous prayer author names are not rendered in UI.
- Invite-code joining does not expose all groups.

## 3. UX QA

Check:

- A member can understand the next action on mobile.
- Check-in feels possible in 20 seconds.
- Prayer request visibility is visible before submit.
- Leader dashboard copy feels like care, not surveillance.
- Empty states are gentle and useful.
- Text does not overflow cards or buttons.

## 4. Developer QA

Run when possible:

```bash
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run build
```

Also check:

- `git status --short`
- `git diff --check`
- README setup instructions
- Supabase migration order

## 5. Beta QA

Confirm the MVP can support this flow:

1. Leader signs up.
2. Leader creates profile.
3. Leader creates a room.
4. Leader shares invite code.
5. Member signs up.
6. Member joins by invite code.
7. Member creates today's check-in.
8. Member creates a prayer request.
9. Another member taps "기도했어요".
10. Leader opens the care dashboard.

Output format:

1. Pass/fail summary
2. Critical issues
3. Non-blocking issues
4. Files or settings to fix
5. Recommended next step

