# Decision Record

## Decision

Upgrade Leader Care Board from v1 to a no-schema v1.1 / v1.5 pass.

## Date

2026-06-19

## Context

The user asked to move from Leader Care Board v1.1 through v1.5 quickly while using sub-agent review to reduce errors, wasted time, and credit cost.

The requested roadmap included member care, individual contact, schedules, alerts, birthdays, RSVP, and visible prayer response. Sub-agent reviews agreed that many of these ideas are valuable, but schema/RLS-heavy items should not be added before the first reliable leader/member smoke test.

## Options Considered

- Build all requested v1.5 ideas now, including RSVP, birthday cues, notification inbox, and contact features.
- Build only v1.1 board polish and defer all v1.5 work.
- Build v1.1 board polish plus the smallest no-schema v1.5 improvement using existing `prayer_reactions`.

## Chosen Path

- Build v1.1 board polish:
  - care-priority sorting
  - clearer care labels
  - copy-message preview
  - member-only today check-in count
  - warmer empty and status copy
- Build the smallest no-schema v1.5:
  - allow leaders to mark a visible prayer as remembered/prayed from `/leader`
  - reuse existing `prayer_reactions`
  - show safe action feedback on `/leader`

## Why This Fits Donghaeng Room

- Daily check-in: makes leader-visible check-in signals easier to interpret without attendance language.
- Prayer memory: lets the leader respond from the prayer timeline without creating chat or alerts.
- Leader care: helps a leader decide who or what to remember first in under 30 seconds.

## What We Are Not Doing

- No chat or in-app direct messaging.
- No stored phone/Kakao/contact directory.
- No birthday fields or birthday feed.
- No RSVP, attendance status, scoring, or event management.
- No notification inbox, push, SMS, Kakao API, email digest, or realtime alerts.
- No database migration, RLS change, dependency, or service-role use.

## Risks

- The public/mobile auth flow is still a separate blocker for external beta.
- The leader board must still be manually tested with 1 leader and 2 members.
- Quiet-member cues can feel like monitoring if copy is not tested with real members.

## Follow-Up

- Run full verification.
- Test `/leader` with real leader/member data.
- Only consider schema-backed v1.5 work after one leader confirms the board helps weekly care.
