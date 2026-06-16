# Decision Record

## Decision

Approve a narrowed MVP beta-readiness stabilization pass before public beta testing.

## Date

2026-06-16

## Context

The Daily Expert Feedback Loop identified four priorities that block or weaken the first public beta loop:

1. Auth callback redirect safety.
2. Safe server-action error handling and user-facing failure states for join, create, check-in, and prayer flows.
3. Clearer first-use no-group screen with separate leader and member paths.
4. Simple copy-ready invite message and code experience for leaders after group creation.

This is not feature expansion. It is a pre-beta stabilization pass for signup, onboarding, invite, check-in, prayer, and leader reuse readiness.

## Options Considered

- Build all four now as stabilization.
- Build simplified versions only and defer richer invite/onboarding features.
- Defer until after beta and test manually.
- Remove from scope to avoid touching app behavior before beta.

## Competitor Differentiation Review

- KakaoTalk: The invite message may be copied into KakaoTalk, but Donghaeng Room must not add chat, replies, read receipts, or real-time messaging.
- Naver BAND: The no-group screen and invite card must not become a general group board, feed, or community home.
- YouVersion: No Bible content, plans, or devotional reading feature is involved.
- Hallow / Glorify / Pray.com: No devotional media, audio, prayer generation, or AI spiritual content is involved.
- Planning Center / Church Center: No church ERP, attendance scoring, department reporting, or admin workflow is involved.

Decision: These items strengthen the unique wedge because they make the existing check-in, prayer memory, invite, and leader care loop safer and easier to test.

## Feature Meeting Decisions

### 1. Auth Callback Redirect Safety

Decision: Build now.

Reason: Auth callback safety is required before public beta. It prevents unsafe redirects and protects the login/signup loop without adding product scope.

Approved scope:

- Accept only safe internal redirect paths.
- Fall back to the app root when redirect input is missing or unsafe.
- Preserve Supabase auth callback behavior.

Out of scope:

- New auth providers.
- Kakao login.
- Passwordless magic link redesign.
- Custom auth screens beyond needed error/safety handling.

### 2. Server-Action Error Handling And Failure States

Decision: Build simplified version now.

Reason: Beta users need clear feedback when create group, join group, check-in, or prayer actions fail. This should be small and user-facing, not a full notification system.

Approved scope:

- Safe redirects or state handling for known server-action failures.
- Short Korean error/success messages.
- No sensitive database or auth details exposed to users.
- Preserve existing server-action flow.

Out of scope:

- Toast framework.
- Error tracking service.
- Analytics dashboard.
- Broad form architecture refactor.

### 3. First-Use No-Group Screen

Decision: Build now.

Reason: First-time leaders and members must know which path to choose before beta. This reduces onboarding confusion without adding new features.

Approved scope:

- Clear leader path: "리더라면 방 만들기".
- Clear member path: "멤버라면 초대코드 입력".
- Keep the screen mobile-first and care-centered.

Out of scope:

- Multi-step onboarding.
- Church setup wizard.
- Role management screens.
- Tutorial carousel.

### 4. Copy-Ready Invite Message And Code

Decision: Build simplified version now.

Reason: Leaders need a copyable message/code to invite 1-2 beta members. This directly supports public beta testing and leader reuse validation.

Approved scope:

- Show invite code clearly after group creation.
- Provide a simple copy-ready Korean message.
- Make local/public URL behavior safe if a link is shown.
- Explain Donghaeng Room as prayer memory/check-in, not a chat replacement.

Out of scope:

- Real-time chat invites.
- SMS or Kakao API sending.
- Push notifications.
- QR codes.
- Member management dashboard.

## Chosen Path

Build the stabilization pass now, with item 2 and item 4 intentionally simplified.

## Why This Fits Donghaeng Room

- Daily check-in: Error states and first-use clarity help members reach and complete the check-in loop.
- Prayer memory: Prayer submission failures need clear feedback, and invite flow brings members into the prayer card loop.
- Leader care: Leaders need a safe way to create a room, invite members, and see whether the core loop works before beta.

## What We Are Not Doing

- No full chat.
- No BAND-style feed or board.
- No Bible content.
- No devotional media or AI prayer generation.
- No Planning Center-style church administration.
- No payment.
- No push notifications.
- No file upload.
- No native app work.
- No dependency additions.
- No database schema change unless a blocker is discovered and separately approved.

## Risks

- Error messages could leak technical details if not carefully mapped.
- Invite links could accidentally use localhost or 127.0.0.1 in public beta.
- A richer invite experience could drift toward chat or admin tooling if not kept narrow.
- Redirect handling must avoid open redirect behavior.

## Follow-Up

- Create an implementation ticket for a bounded stabilization pass.
- During implementation, inspect current files first and patch only missing gaps.
- Run lint, typecheck, build, and a manual public beta smoke test when dependencies and environment are available.
