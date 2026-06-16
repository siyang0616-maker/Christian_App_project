# Implementation Ticket

## Title

MVP beta-readiness stabilization before public testing

## Approved Brief

Decision record: `superpowers/decisions/2026-06-16-mvp-beta-stabilization.md`

Implement only the approved stabilization pass:

1. Auth callback redirect safety.
2. Simplified server-action error handling and user-facing failure states for group create, group join, check-in, and prayer flows.
3. Clear first-use no-group screen with leader and member paths.
4. Simple copy-ready leader invite message/code experience.

This is not feature expansion. It is beta-readiness stabilization.

## Scope

- Inspect existing auth callback, server actions, form components, app entry screen, and leader invite flow.
- Patch only missing gaps needed for the four approved work items.
- Keep copy short, Korean, mobile-first, and care-centered.
- Preserve Supabase RLS and existing data model.
- Keep invite experience limited to visible code/message/copy behavior.

## Work Item Decisions

- Auth callback redirect safety: Build now.
- Server-action error handling and failure states: Build simplified version now.
- First-use no-group screen: Build now.
- Copy-ready invite message/code: Build simplified version now.

## Files Likely To Change

Inspect first; touch only if needed.

- `app/auth/callback/route.ts`
- `app/page.tsx`
- `lib/actions/auth.ts`
- `lib/actions/groups.ts`
- `lib/actions/check-ins.ts`
- `lib/actions/prayers.ts`
- `lib/action-feedback.ts`
- `components/action-message.tsx`
- `components/create-group-form.tsx`
- `components/join-group-form.tsx`
- `components/check-in-form.tsx`
- `components/prayer-request-form.tsx`
- `components/leader-invite-card.tsx`
- `components/submit-button.tsx`

## Files Not To Touch

- `package.json`
- `pnpm-lock.yaml`
- `supabase/schema.sql`
- `supabase/migrations/*`
- App database schema or RLS policy files
- Native app files
- Payment, analytics, push notification, upload, or AI-related files

## Technical Notes

- For redirect safety, accept only internal paths that start with `/` and reject `//` or external URLs.
- For server actions, map known failures to short user-facing codes/messages.
- Do not expose raw Supabase errors to users.
- Keep failure handling compatible with Next.js App Router server actions.
- Keep forms usable without adding dependencies.
- If invite links are shown, avoid sending localhost or `127.0.0.1` as a public beta link.

## Privacy And Security Notes

- Do not weaken RLS or bypass Supabase authorization.
- Do not expose private check-in or prayer content in URLs, logs, or messages.
- Do not reveal anonymous prayer authors.
- Do not add service_role keys or any secret to app code.
- Keep error messages helpful but non-technical.

## Acceptance Criteria

- Unsafe auth callback redirect values fall back to a safe internal route.
- Group create failures show a clear Korean failure state.
- Invite-code join failures show a clear Korean failure state.
- Check-in save failures show a clear Korean failure state.
- Prayer request and "기도했어요" failures show clear Korean failure states.
- Success states are visible enough for beta users to trust that their action worked.
- First-use no-group screen clearly separates "리더라면 방 만들기" and "멤버라면 초대코드 입력".
- Leader sees an invite code and a copy-ready Korean invite message after group creation.
- Invite copy positions Donghaeng Room as check-in and prayer memory, not chat.
- No new app features beyond the four approved stabilization items.
- No dependencies added.
- No database schema changes.

## Verification

- [ ] Lint
- [ ] Typecheck
- [ ] Build
- [ ] Manual local smoke test: signup/login path reaches profile/group screen.
- [ ] Manual local smoke test: leader can create group.
- [ ] Manual local smoke test: member can attempt join with valid and invalid invite code.
- [ ] Manual local smoke test: check-in success and failure states are visible.
- [ ] Manual local smoke test: prayer request and "기도했어요" success/failure states are visible.
- [ ] Manual mobile-width check for no-group screen and invite message.
- [ ] Public beta smoke test if Vercel/Supabase environment is ready.

## Stop Conditions

- The task requires new auth providers, chat, feed, Bible content, devotional media, payment, push notifications, file upload, native app work, or church ERP scope.
- The task requires a database schema or RLS change not explicitly approved in a new decision record.
- The implementation would add a dependency.
- The invite flow starts becoming message sending or member management instead of copy-ready invite support.
