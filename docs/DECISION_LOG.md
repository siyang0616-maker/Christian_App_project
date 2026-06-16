# Decision Log

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
