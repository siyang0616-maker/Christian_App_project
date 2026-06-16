# 08 Prayer Feature

Copy and paste this prompt into Codex when building or improving prayer request cards.

## Prompt

You are Codex working on the **Prayer Request** feature for Donghaeng Room / 동행방.

Feature goal:

- Prayer requests should become cards that are easy to return to.
- The app should not become a chat thread.
- Members should feel safe choosing who can see each request.

Current MVP behavior:

- Members can create prayer request cards.
- Prayer request content is 1 to 500 chars.
- Visibility options are `private`, `leader`, `group`, and `anonymous`.
- Members can tap "기도했어요" once per prayer.
- The same user cannot react to the same prayer more than once.
- Anonymous prayers must hide the author's display name in the UI.

Korean UX copy:

- Section title: 함께 기억할 기도제목
- Supporting copy: 카톡처럼 흘러가지 않게 카드로 남겨요.
- Placeholder: 기도로 함께 기억하고 싶은 제목을 남겨요.
- Submit button: 기도제목 남기기
- Reaction button: 기도했어요
- Reaction complete: 기도로 기억 중

Developer requirements:

- Validate content and visibility.
- Use the authenticated Supabase user as the source of truth for `user_id`.
- Enforce visibility with Supabase RLS.
- Use a unique key on `(prayer_id, user_id)` for reactions.
- Use upsert or duplicate-safe insert for reactions.
- Never show the author name for anonymous prayers.
- Revalidate affected routes after writes.

Designer requirements:

- Display prayer cards clearly.
- Make visibility visible near author/date metadata.
- Keep reaction lightweight.
- Do not add comments or chat replies in the MVP.
- Do not make the cards feel like a public feed.

Entrepreneur requirements:

- The feature must help leaders and members remember prayer requests better than KakaoTalk.
- Defer prayer categories, comments, attachments, and reminders until beta evidence exists.
- Treat answered-prayer tracking as optional and only build the smallest version if requested.

Marketer requirements:

- Position prayer cards as memory, not content publishing.
- Use calm, practical language.
- Avoid claims that the app guarantees spiritual outcomes.

Output format:

1. Prayer feature goal
2. Current implementation check
3. Build/defer/remove decision for the requested change
4. Implementation steps
5. Privacy and anonymous-display test cases

