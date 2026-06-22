# Decision: Modern UI Dashboard Pass

## Date

2026-06-22

## Context

User testing feedback showed that the app still felt too plain and not clearly differentiated from KakaoTalk for leaders.
The leader view especially needed to be easier to scan when multiple members and prayer requests accumulate.

## Comparison Review

- KakaoTalk: This does not add chat. It makes prayer/check-in records easier to revisit.
- Naver BAND: This does not add a general board or feed. It keeps the screen focused on leader care.
- YouVersion / Bible App: This does not add Bible content.
- Hallow / Glorify / Pray.com: This does not add devotional media.
- Planning Center / Church Center: This does not add church administration, attendance scoring, or broad ERP behavior.

## Decision

Build narrowed version.

## Approved Scope

- Make `/leader` use a wider responsive layout on desktop/tablet while preserving mobile-first behavior.
- Reorganize the leader board into summary, priority, prayer timeline, and member care panels.
- Make prayer care controls visually clearer without changing the underlying data model.
- Improve member-facing check-in and prayer forms with more modern card surfaces.
- Replace the old native visibility select with touch-friendly radio cards.

## Out Of Scope

- New features.
- Chat or direct messaging.
- Schedule, RSVP, attendance, or notification inbox.
- New database schema.
- New dependencies.
- Changes to RLS or privacy rules.

## Acceptance Criteria

- Leader dashboard is easier to scan with multiple members.
- Leader and member surfaces no longer feel like a narrow old mobile form on wide screens.
- Visibility choice is clearer before submitting sensitive content.
- Existing verification continues to pass.
