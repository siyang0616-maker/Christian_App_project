# Decision Record

## Decision

Build a narrowed leader-first beta UX refinement before the first real beta.

## Date

2026-06-16

## Context

The public beta screen review showed that the leader home experience currently gives prominent space to the invite message before the leader can quickly scan member care needs. The leader also needs a copy-ready invite message, but the full message should not dominate the first leader view.

## Options Considered

- Keep the current order and collect beta feedback first.
- Move the leader care dashboard above the leader's personal check-in flow and make the invite message compact by default.
- Add deeper tracking such as per-item timestamps, frequency history, or a numeric 0-10 mood scale.

## Chosen Path

- Move the leader care dashboard above the leader's personal check-in flow.
- Make the invite card compact by default.
- Show invite code and copy actions first.
- Add an expandable editable invite message area.
- Copy the edited invite message from the current text area without saving it to the database.
- Clarify that today's rhythm is a once-a-day check-in, not item-by-item time tracking.

## Why This Fits Donghaeng Room

- Daily check-in: Keeps the member check-in loop clear while clarifying that the current rhythm is a daily check-in.
- Prayer memory: Keeps invite copy focused on remembering prayer requests without becoming a chat or content app.
- Leader care: Prioritizes the leader's reason to return: quickly seeing who may need care.

## What We Are Not Doing

- No database schema changes.
- No per-item timestamps.
- No frequency tracking.
- No 0-10 mood score.
- No persisted custom invite templates.
- No chat, feed, AI, Bible content, push, upload, payment, native app, or church ERP behavior.

## Risks

- The leader dashboard can feel like monitoring if copy emphasizes attendance or compliance.
- Editable invite copy may be mistaken as saved if the UI does not clearly keep it local to the current copy action.
- Reordering the leader home may affect the member flow if role-specific rendering is not kept tight.

## Follow-Up

- Implement only the approved UI refinement.
- Run lint, typecheck, and build.
- Manually test leader and member home order separately.
- During beta QA, confirm that the leader sees care information first and that members do not see leader-only surfaces.
