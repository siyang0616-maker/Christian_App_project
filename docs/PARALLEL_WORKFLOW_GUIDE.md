# Parallel Workflow Guide

This guide explains how to use the Superpowers parallel workstream layer without changing Donghaeng Room's MVP scope.

## Purpose

Parallel work is for splitting already-approved work into independent lanes. It is not a way to skip feature meetings, code review, privacy review, or QA.

## Commands

- Plan lanes: `superpowers/commands/parallel-plan.md`
- Run one lane: `superpowers/commands/parallel-run.md`
- Merge review: `superpowers/commands/parallel-merge-review.md`

## Lanes

### Lane A: Backend/Security

- auth callback safety
- server action error handling
- Supabase/RLS review
- no UI copy changes unless necessary

### Lane B: UX/Onboarding

- no-group screen
- leader/member path clarity
- mobile UI
- no DB/auth logic changes

### Lane C: Marketing/Beta Copy

- invite message
- beta guide
- onboarding copy
- no app logic changes

### Lane D: QA/Pre-Beta

- manual test checklist
- privacy test cases
- beta readiness audit
- no implementation changes

### Lane E: Docs/Roadmap

- update state files
- decision logs
- backlog
- no app code changes

## Planning Rules

1. Start with an approved parent task.
2. Create one `parallel-task` spec per lane.
3. Declare allowed files and forbidden files.
4. Avoid overlapping file writes.
5. Keep risky files sequential unless explicitly approved.

## Files That Usually Must Stay Sequential

- `supabase/schema.sql`
- `supabase/migrations/*`
- `lib/supabase/*`
- `middleware.ts`
- `package.json`
- `pnpm-lock.yaml`
- auth callback and server action files when multiple lanes need them

## Safe Parallel Examples

- Lane C updates beta copy docs while Lane D creates QA checklist.
- Lane E updates backlog/state files while Lane B drafts UX-only recommendations.
- Lane A reviews RLS policy while Lane D writes manual privacy test cases without changing code.

## Unsafe Parallel Examples

- Two lanes editing `app/page.tsx`.
- One lane editing auth callback while another edits auth actions without a merge gate.
- One lane changing copy and another changing the same component layout.
- Any schema or package change mixed with parallel implementation.

## Merge Gate

Always run `superpowers/commands/parallel-merge-review.md` after parallel lanes complete.

The merge gate must review:

- file conflicts
- duplicated work
- scope creep
- security and privacy risk
- competitor drift
- verification gaps

If conflicts exist, stop and ask for a manual decision.
