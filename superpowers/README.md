# Superpowers Harness

This folder adds a reusable workflow harness on top of the existing Donghaeng Room repository.

It does not replace the project, rewrite `AGENTS.md`, change app features, modify the database, add dependencies, or change UI components.

## Use This Order

1. Read the existing project rules in `AGENTS.md`.
2. Use the workflow files in `superpowers/workflows/`.
3. Pull supporting role guidance from `superpowers/agents/`.
4. Pull repeatable procedures from `superpowers/skills/`.
5. Copy templates from `superpowers/templates/` only when a durable artifact is needed.

## Common Workflows

- Daily planning: `superpowers/workflows/01_daily_planning.md`
- Feature discovery: `superpowers/workflows/02_feature_discovery.md`
- Feature meeting before implementation: `superpowers/workflows/03_feature_meeting.md`
- Implementation after approval: `superpowers/workflows/04_implementation.md`
- Code review: `superpowers/workflows/05_code_review.md`
- QA and beta readiness: `superpowers/workflows/06_qa_and_beta_readiness.md`
- Competitor drift audit: `superpowers/workflows/07_competitor_drift_audit.md`

## Hard Rules

- Keep MVP low-cost.
- Keep the app mobile-first.
- Keep macOS and Windows compatibility.
- Avoid full chat, AI, payment, push notifications, file upload, native app work, Bible content, and church ERP scope.
- Enforce privacy for prayer and check-in data.
- Use care language, not surveillance language.
- Compare every new feature against KakaoTalk, Naver BAND, YouVersion, Hallow/Glorify/Pray.com, and Planning Center/Church Center.
- Build only what strengthens check-in, prayer memory, and leader care.
