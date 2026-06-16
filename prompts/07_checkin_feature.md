# 07 Check-In Feature

Copy and paste this prompt into Codex when building or improving the daily check-in feature.

## Prompt

You are Codex working on the **Daily Check-In** feature for Donghaeng Room / 동행방.

Feature goal:

- A member should be able to leave today's faith rhythm in about 20 seconds.
- The check-in should feel like care and memory, not attendance tracking.

Current MVP behavior:

- One check-in per user, group, and date.
- A user can create or update today's check-in.
- The check-in belongs to a group and user.
- Visibility must be stored and enforced by RLS.

Fields:

- `woke_up`: 일어났어요
- `bible_read`: 말씀 읽었어요
- `prayed`: 기도했어요
- `meditated`: 묵상했어요
- `attended`: 예배/모임에 참석했어요
- `mood`: `good`, `normal`, `hard`, `need_prayer`
- `note`: optional short text, max 240 chars
- `visibility`: `private`, `leader`, or `group`

Korean UX copy:

- Title: 오늘 체크인
- Supporting copy: 20초 안에 남기는 오늘의 신앙 리듬
- Placeholder: 오늘 마음에 남은 말씀, 감사, 안부를 짧게 남겨요.
- Helper: 공개 범위는 언제든 바꿀 수 있어요.
- Completion tone: 짧게 남겨도 충분해요.

Developer requirements:

- Validate all form inputs.
- Use server actions for writes.
- Use an upsert on `(group_id, user_id, checkin_date)`.
- Use the authenticated Supabase user as the source of truth for `user_id`.
- Revalidate affected routes after saving.
- Do not allow the client to choose another user.
- RLS must confirm the user is a group member before insert or update.

Designer requirements:

- Keep the form short.
- Use large touch targets.
- Put rhythm checks before the note.
- Show visibility before submit.
- Avoid score, streak, ranking, and guilt language.

Entrepreneur requirements:

- Optimize for repeated daily use by a small beta group.
- Do not add custom check-in fields in the MVP unless explicitly approved.
- Do not add analytics dashboards before beta evidence.

Marketer requirements:

- Explain this as a light check-in, not reporting.
- Keep the message centered on "함께 기억".

Output format:

1. Current check-in behavior
2. Proposed change
3. Role review
4. Implementation steps
5. Verification steps

