# Project State

## Product

Donghaeng Room / 동행방 is a mobile-first Christian small group check-in app.

## North Star

Make one small group leader say: "I want to use this again next week."

## Core Wedge

- Daily check-in
- Prayer request cards
- "기도했어요" reaction
- Care-oriented leader dashboard
- Lightweight Korean small group workflow

## Current Stage

MVP stabilization before first real beta with 1 leader and 2 members.

## Current Readiness

Not ready for external beta until the full public 1-leader/2-member smoke test is complete.

## Stabilization Progress

- Lane A Backend/Security: auth callback redirect safety and safe server-action failure redirects have been patched locally.
- Lane B UX/Onboarding: first-use leader/member paths have been clarified locally.
- Lane C Marketing/Beta Copy: copy-ready leader invite messaging has been aligned in app copy and beta docs.
- Lane D QA/Pre-Beta: manual first-beta QA checklist exists at `docs/QA_CHECKLIST.md`.
- Lane E Docs/State: state files now track remaining blockers before beta.
- Pre-beta operations: beta data deletion handling is documented.
- Verification: lint, typecheck, build, and basic public URL HTTP checks pass.

These changes still need the full public leader/member smoke test before beta invite.

## Known Foundation

- Next.js App Router app exists.
- Supabase Auth/Postgres/RLS schema exists.
- Vercel deployment docs exist.
- Beta guide and feedback forms exist.
- Superpowers harness exists with agents, skills, workflows, templates, commands, decisions, and tickets.

## Current Priority

Complete the full public leader/member smoke test without expanding scope.

## Do Not Expand Into

- Full chat
- Naver BAND-style board/feed
- Bible content platform
- AI devotional/prayer generation
- Push/SMS/Kakao API
- Payment
- File upload/storage
- Native app
- Church ERP
