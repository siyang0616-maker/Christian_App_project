# Workflow 09: Post-Beta Learning Loop

## Trigger

After a 1-week beta run, leader interview, member feedback round, or failed beta attempt.

## Goal

Turn real beta evidence into a narrow roadmap update without drifting into feature expansion.

## Required Input

- Beta participant count.
- Leader feedback.
- Member feedback.
- Usage signals if available.
- Known blockers.
- Privacy or deletion requests.
- Support issues and screenshots.

## Agents To Call

- Retention Analyst
- Beta Operator
- Privacy Officer
- Entrepreneur
- Designer
- Developer
- QA Reviewer

## Skills To Use

- retention-review
- beta-readiness-review
- privacy-risk-review
- cost-risk-review
- roadmap-update

## Step-By-Step Process

1. Summarize what happened in the beta.
2. Separate evidence from assumptions.
3. Review whether leaders had a reason to return next week.
4. Review whether members checked in more than once and why.
5. Identify the first-week aha moment or the absence of one.
6. Identify drop-off points and onboarding friction.
7. Review privacy concerns, deletion requests, and membership edge cases.
8. Review cost or operational risks revealed by the beta.
9. Decide continue, improve before expanding, pause, or pivot.
10. Pick the next 1-3 tasks.

## Decision Gate

Do not expand to more leaders until the first beta evidence shows the leader can invite members, members can complete the core loop, and at least one leader sees enough value to consider using Donghaeng Room again.

## Files To Update

- A filled copy of `superpowers/templates/retention-analysis.md`.
- A filled copy of `superpowers/templates/beta-feedback-summary.md`.
- `docs/POST_BETA_REVIEW.md` if the standing review checklist changes.
- `docs/PROJECT_STATUS.md` if roadmap priorities change.

## Final Output Format

```md
## Post-Beta Learning Loop

Decision:
- Continue / Improve before expanding / Pause / Pivot

Evidence:
- ...

Leader Reuse:
- ...

Member Repeat Use:
- ...

Privacy Or Trust Issues:
- ...

Next 1-3 Tasks:
- ...
```
