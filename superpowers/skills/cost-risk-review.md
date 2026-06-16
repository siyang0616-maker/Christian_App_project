# Cost Risk Review Skill

## Purpose

Prevent MVP work from adding avoidable paid infrastructure, usage-based services, or operational complexity.

## When To Use

- Before approving a feature.
- Before adding realtime, storage, AI, push, SMS, email automation, analytics, or paid APIs.
- During roadmap review.

## Inputs Required

- Proposed feature or workflow.
- Infrastructure touched.
- Expected user count for beta.
- Existing free-tier services.
- Alternative low-cost implementation path.

## Step-By-Step Process

1. Identify whether the feature adds realtime, storage, AI, push, SMS, paid email, paid APIs, or analytics costs.
2. Check whether it can be solved with static UI, server actions, and existing Supabase tables.
3. Check whether it works within Vercel and Supabase free-tier MVP assumptions.
4. Identify hidden operational costs such as support, moderation, or data export.
5. Recommend build, simplify, manual test, defer, or reject.

## Output Format

```md
## Cost Risk Review

Cost Decision:
- Safe for MVP / Simplify / Defer / Reject

Cost Drivers:
- ...

Low-Cost Alternative:
- ...

Free-Tier Fit:
- ...

Operational Risk:
- ...
```

## Acceptance Criteria

- Explicitly checks realtime, storage, AI, push, SMS, and paid API risk.
- Offers a static/server-action/existing-table alternative when possible.
- Blocks features that are not safe for free-tier MVP unless separately approved.
