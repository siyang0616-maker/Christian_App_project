# Feature Meeting Skill

## Purpose

Run a short pre-implementation meeting across product, design, engineering, marketing, security, and QA.

## When To Use

- Before implementation work starts.
- When a task touches user flows, copy, privacy, database reads/writes, or beta readiness.
- When the user asks "should we build this?"

## Inputs Required

- Feature idea or bug.
- User and scenario.
- Known evidence.
- Desired output: decision, brief, implementation ticket, or QA plan.

## Step-By-Step Process

1. Summarize the feature idea.
2. Call the Entrepreneur agent for scope and beta value.
3. Call the Designer agent for mobile and care-language review.
4. Call the Developer agent for implementation constraints.
5. Call the Security Reviewer agent if data, auth, visibility, or membership are touched.
6. Call the Marketer agent if invite, onboarding, or positioning copy changes.
7. Call the QA Reviewer agent for acceptance and smoke-test needs.
8. Decide build now, narrow, defer, reject, or investigate.

## Output Format

```md
## Feature Meeting

Feature:
- ...

Agent Notes:
- Entrepreneur:
- Designer:
- Developer:
- Security:
- Marketer:
- QA:

Decision:
- ...

Next Artifact:
- Feature brief / Implementation ticket / Decision record / No action
```

## Acceptance Criteria

- Includes explicit decision before implementation.
- Uses care language and privacy checks.
- Includes comparison-product drift check when relevant.
- Does not start coding by itself.
