# Decision Log

## 2026-06-22

### Modern UI Dashboard Pass

- Decision record: `superpowers/decisions/2026-06-22-modern-ui-dashboard-pass.md`
- Implementation ticket: `superpowers/tickets/2026-06-22-modern-ui-dashboard-pass.md`
- Decision: build a narrowed UI/UX modernization pass without adding new product features.
- Approved areas:
  - Wider responsive `/leader` layout.
  - Leader board summary, priority, prayer timeline, and member care panels.
  - Clearer prayer care controls.
  - More modern member check-in and prayer form surfaces.
  - Touch-friendly visibility selector.
- Deferred:
  - Chat, direct messaging, schedule, RSVP, attendance, notification inbox, and new schema work.

## 2026-06-19

### Leader Prayer Care Marks

- Decision record: `superpowers/decisions/2026-06-19-leader-prayer-care-marks.md`
- Implementation ticket: `superpowers/tickets/2026-06-19-leader-prayer-care-marks.md`
- Decision: build a narrowed DB-backed leader-only prayer care marking feature.
- Approved areas:
  - Leader-only marks for `함께 기도` and `개별 돌봄`.
  - Leader-only `중요` and `계속 기억` flags.
  - RLS-backed separation from member-facing prayer cards.
- Deferred:
  - Chat/comments.
  - Schedules, RSVP, attendance, and notification inbox.
  - Member-facing leader classification labels.
  - AI classification.

### Leader Care Board No-Schema Upgrade

- Decision record: `superpowers/decisions/2026-06-19-leader-care-board-no-schema-upgrade.md`
- Implementation ticket: `superpowers/tickets/2026-06-19-leader-care-board-no-schema-upgrade.md`
- Decision: build a no-schema v1.1 / v1.5 improvement pass for the leader care board.
- Approved areas:
  - Care-priority sorting for leader review.
  - Softer care labels and count labels.
  - Copy-ready message preview before copying.
  - Member-focused today check-in count.
  - Leader can mark a visible prayer as remembered from `/leader` using existing `prayer_reactions`.
  - Revalidate `/leader` after check-in, prayer, reaction, group create, and join actions.
- Deferred:
  - Birthday reminders.
  - Stored care notes or follow-up state.
  - Contact directory or in-app direct messaging.
  - RSVP, schedules, attendance, and event management.
  - Notification inbox, push, SMS, Kakao API, and realtime alerts.

## 2026-06-16

### Superpowers Harness

- Added a Superpowers-style harness under `superpowers/`.
- Added agents, skills, workflows, templates, decisions, and tickets.
- Added active command files under `superpowers/commands/`.

### MVP Beta Stabilization

- Decision record: `superpowers/decisions/2026-06-16-mvp-beta-stabilization.md`
- Decision: build a narrowed beta-readiness stabilization pass before public beta.
- Approved areas:
  - Safe auth redirect behavior.
  - Safe server-action error handling.
  - Clear leader/member first-use paths.
  - Copy-ready leader invite message/code.

### Pre-Beta Reality Check

- Current audit decision: Not ready for external beta until public URL smoke test, deletion handling, and verification checks are complete.

### Sequential Lane Stabilization Progress

- Lane A Backend/Security completed locally: safer auth callback redirect handling and safer server-action failure redirects.
- Lane B UX/Onboarding completed locally: clearer first-use paths for leaders and members.
- Lane C Marketing/Beta Copy completed locally: copy-ready leader invite message aligned with beta positioning.
- Lane D QA/Pre-Beta completed locally: manual first-beta QA checklist added.
- Lane E Docs/State completed locally: project state, sprint, backlog, risk register, and beta status updated.
- Decision: do not expand product scope. Next required work is verification, public smoke testing, and beta data deletion handling.

### Leader-First Beta UX Refinement

- Decision record: `superpowers/decisions/2026-06-16-leader-first-beta-ux-refinement.md`
- Implementation ticket: `superpowers/tickets/2026-06-16-leader-first-beta-ux-refinement.md`
- Decision: build a narrowed UI-only refinement before beta.
- Approved areas:
  - Move leader care dashboard above the leader's personal check-in flow.
  - Make invite message compact by default.
  - Let leaders edit the invite message locally before copying.
  - Clarify that today's rhythm is a once-a-day check-in.
- Deferred:
  - Per-item timestamps.
  - Frequency tracking.
  - 0-10 mood score.
  - Persisted invite message templates.
