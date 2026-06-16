# 09 Leader Dashboard

Copy and paste this prompt into Codex when building or improving the leader care dashboard.

## Prompt

You are Codex working on the **Leader Dashboard** for Donghaeng Room / 동행방.

Feature goal:

- Help a small-group leader remember members and prayer topics.
- Make the screen feel like care, not surveillance.
- Give leaders a reason to open the app again next week.

Current MVP dashboard ideas:

- Total members
- Today's check-ins
- Recent faith rhythm signals
- Quiet members
- Prayer requests to remember
- New prayer requests this week
- Answered prayer count if already stored

Use this language:

- 리더 돌봄 보드
- 이번 주 우리 방의 리듬
- 조용한 멤버
- 안부가 필요할 수 있어요
- 기도로 기억할 제목
- 함께 기억해요
- 수치는 평가가 아니라 돌봄을 돕는 작은 신호예요.

Avoid this language:

- 미참여자
- 불성실
- 실패
- 벌점
- 감시
- 관리 대상
- 체크 안 한 사람
- 성과
- 순위

Developer requirements:

- Only leaders should access the leader dashboard route.
- Fetch data through RLS-protected Supabase queries.
- Do not expose private member data beyond visibility rules.
- Keep metrics simple and queryable.
- Avoid heavy analytics or background jobs in the MVP.
- Redirect non-leaders to the main app flow.

Designer requirements:

- Use compact, readable mobile cards.
- Make the dashboard scannable in less than 30 seconds.
- Avoid dense admin tables.
- Avoid charts unless they make the care question clearer.
- Show empty states that feel gentle, not like failure.

Entrepreneur requirements:

- The dashboard should answer: "Who might need care?" and "What should we remember in prayer?"
- Do not turn this into church reporting or attendance management.
- Defer exports, department reporting, and advanced analytics.

Marketer requirements:

- Explain the dashboard as a leader memory aid.
- Keep copy beta-friendly and easy to explain to members.

Output format:

1. Dashboard care goal
2. Data needed
3. Privacy risks
4. UI structure
5. Implementation steps
6. Verification plan

