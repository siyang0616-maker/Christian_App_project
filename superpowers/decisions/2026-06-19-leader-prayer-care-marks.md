# Decision Record

## Decision

Build a narrowed leader-only prayer care marking feature.

## Date

2026-06-19

## Context

Leader testing showed that the current Leader Care Board still feels too generic. A leader can mark a prayer as remembered, but cannot distinguish what should be prayed together, what should be handled personally, what is important, or what needs ongoing weekly memory.

## Options Considered

- Keep using only `prayer_reactions`.
- Add labels directly to `prayers`.
- Add a leader-only care mark table.

## Chosen Path

- Add a leader-only `leader_prayer_care_marks` table.
- Let leaders mark each visible prayer as `함께 기도` or `개별 돌봄`.
- Let leaders toggle `중요` and `계속 기억`.
- Show those marks only on the leader dashboard.
- Keep member-facing prayer cards free of leader classification labels.

## Why This Fits Donghaeng Room

- Daily check-in: supports follow-up from member check-ins and prayer needs.
- Prayer memory: turns prayer requests into items leaders can remember beyond the current day.
- Leader care: helps leaders separate shared group prayer from quiet personal care.

## What We Are Not Doing

- No chat threads, comments, or replies.
- No schedules, RSVP, attendance, scoring, or church ERP flow.
- No push, SMS, Kakao API, or notification inbox.
- No AI classification.
- No member-facing labels that expose a leader's private care judgment.

## Risks

- Care labels can feel like monitoring if exposed to members.
- Schema/RLS changes need careful verification.
- This may slow the public smoke test, so the implementation must stay narrow.

## Follow-Up

- Test with one leader and one member.
- Ask whether the leader can explain the feature as "이번 주 다시 기억할 기도제목 정리" without extra training.
