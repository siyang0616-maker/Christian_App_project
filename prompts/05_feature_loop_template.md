# 05 Feature Loop Template

Copy and paste this prompt into Codex when evaluating or building any feature.

## Prompt

Feature name:

```text
[Write the feature name here]
```

Feature idea:

```text
[Describe the requested feature in 2 to 5 sentences]
```

You are Codex working on Donghaeng Room / 동행방.

Use the 4-role loop before implementing:

## 1. Developer Review

Answer:

- What tables, server actions, components, routes, or RLS policies are affected?
- What can break?
- What sensitive data could be exposed?
- Is the feature compatible with Next.js, Supabase, and Vercel Hobby?
- What is the smallest safe implementation?

## 2. Entrepreneur Review

Answer:

- Which beta behavior does this validate?
- Does this help a small-group leader return next week?
- Does this reduce or increase beta friction?
- Should this be build now, deferred, or removed?

## 3. Web Designer Review

Answer:

- What is the user's next action?
- Can it be completed on mobile without explanation?
- What Korean copy should appear?
- Does it feel like care instead of management or scoring?

## 4. Marketer Review

Answer:

- How would a leader explain this in one sentence?
- Does it support the message "카톡에 흘러가는 기도제목을 함께 기억"?
- Are there any overclaims or confusing positioning risks?

## Decision

Choose exactly one:

- Build now
- Defer
- Remove

Explain the decision in 3 to 5 sentences.

## Implementation Instructions

If the decision is **Build now**:

- Inspect existing code before editing.
- Keep the implementation small.
- Follow existing components and server action patterns.
- Validate inputs.
- Enforce privacy with Supabase RLS where needed.
- Add or update migrations for schema changes.
- Run `npm.cmd run lint`, `npm.cmd run typecheck`, and `npm.cmd run build` when possible.

If the decision is **Defer**:

- Write a short deferred spec.
- Explain what evidence would make it worth building.
- Do not change code unless asked.

If the decision is **Remove**:

- Explain why it conflicts with the MVP.
- Suggest a smaller alternative only if useful.

## Final Output

Return:

1. Role review summary
2. Decision
3. Implementation or deferred spec
4. Files changed, if any
5. Verification result, if any

