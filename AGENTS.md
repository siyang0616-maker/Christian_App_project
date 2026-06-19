# Product North Star

The goal is not to build a big Christian app.
The goal is to make one small group leader say:

> "I want to use this again next week."

Keep every product, design, marketing, and engineering decision focused on this outcome.

## Product Definition

Donghaeng Room / 동행방 is a mobile-first Christian small group check-in app.

It is not:

- A KakaoTalk replacement
- A general group messenger
- A Bible content app
- An AI devotional app
- A church ERP
- A native mobile app at MVP stage

Core value:

카톡에 흘러가는 소그룹의 체크인, 기도제목, 컨디션, 리더 돌봄 포인트를 기록으로 남기는 앱.

Main target:

- 소그룹 리더
- 셀장
- 순장
- 목장 리더
- 청년부 리더
- 제자훈련 리더

## Comparison Groups

Use these comparison groups when making product decisions for Donghaeng Room:

1. KakaoTalk
2. Naver BAND
3. YouVersion / Bible App
4. Hallow / Glorify / Pray.com
5. Planning Center / Church Center

Product rule:

Donghaeng Room should not try to beat these products at what they already do best.

Do not compete with:

- KakaoTalk on real-time chat
- Naver BAND on general group board/community features
- YouVersion on Bible content
- Hallow/Glorify on devotional media content
- Planning Center on full church administration

Donghaeng Room should compete only on:

1. Daily small group faith check-in
2. Prayer request cards with visibility controls
3. "I prayed" reaction and prayer memory
4. Care-oriented leader dashboard
5. Lightweight Korean small group workflow

## Comparison-Based Differentiation Loop

Every time we plan, build, review, or improve a feature, answer:

- Are we copying an existing product?
- Are we competing in a market we cannot win?
- Are we strengthening Donghaeng Room's unique wedge?
- Are we helping small group leaders care better?
- Are we making members feel safe, not monitored?
- Are we keeping MVP scope small and low-cost?
- Is this trying to copy KakaoTalk?
- Is this trying to become BAND?
- Is this trying to become a Bible app?
- Is this trying to become a church ERP?
- Or does this strengthen our unique wedge: small group check-in + prayer memory + leader care?

Decision principle:

If a feature does not strengthen daily check-in, prayer memory, or leader care, defer it.

## Active Superpowers Command Usage

Before planning or implementing any meaningful task, Codex must read:

- `docs/PROJECT_STATE.md`
- `docs/CURRENT_SPRINT.md`
- `docs/RISK_REGISTER.md`
- the relevant `/superpowers/commands` file
- the relevant `/superpowers/workflows` file
- the relevant `/superpowers/agents` files

## Sub-Agent Review Usage

The Markdown files in `superpowers/agents/` are role guides, not automatic background workers.

When Codex discovers meaningful product questions, implementation candidates, UX risks, QA gaps, privacy risks, beta-operation issues, or roadmap decisions, Codex should explicitly dispatch real sub-agents when the work can be usefully reviewed in parallel.

Use sub-agents for:

- planning critique before building a meaningful feature
- UX/onboarding review
- QA and beta-readiness review
- privacy and security review
- retention and product-scope review
- implementation work only when file ownership is clear and non-overlapping

Each sub-agent task must include:

- role or lane name
- goal
- exact files or docs to inspect
- allowed files, if edits are permitted
- forbidden files
- expected output format
- how the answer should help the main Codex decision

The main Codex remains the coordinator. It must summarize sub-agent findings, separate facts from recommendations, decide what to do next, and report the decision back to the user before expanding scope.

## Parallel Workstream Rules

1. Parallel work is allowed only when tasks touch clearly separated files.
2. Each parallel task must declare lane name, goal, allowed files, forbidden files, dependencies, acceptance criteria, and merge risk.
3. No two parallel tasks should modify the same file unless explicitly approved.
4. DB schema, RLS, auth, middleware, and package.json changes must not be parallelized without a merge gate.
5. Each parallel task must run lint/typecheck/build if it changes code.
6. The merge gate must review conflicts, duplicated work, scope creep, security risk, and competitor drift.
7. If conflicts exist, stop and ask for manual decision.
