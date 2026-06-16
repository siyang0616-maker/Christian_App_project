# Workflow 08: Pre-Beta Readiness Audit

## Trigger

Before inviting the first real leader or sending the public beta link to members.

## Goal

Confirm Donghaeng Room is realistic, safe, and operationally ready for a tiny public beta.

## Required Input

- Public beta URL.
- Current deployment and Supabase Auth status.
- Known limitations.
- Target leader and member count.
- Current invite message and feedback forms.
- Current data deletion handling plan or known gap.

## Agents To Call

- Privacy Officer
- Beta Operator
- Retention Analyst
- QA Reviewer
- Developer
- Designer
- Security Reviewer

## Skills To Use

- beta-readiness-review
- privacy-risk-review
- retention-review
- cost-risk-review
- qa-check

## Step-By-Step Process

1. Confirm the target URL is public and usable on a phone.
2. Confirm one leader can create a room without help.
3. Confirm the leader can invite 2 members with copy-ready text/code.
4. Confirm a member can join and check in within 2 minutes.
5. Confirm prayer request cards and "기도했어요" can be used without confusion.
6. Review sensitive prayer/check-in data risks.
7. Review anonymous prayer UI and dashboard leakage risks.
8. Review deletion, edit, and group membership edge cases.
9. Review feedback forms and beta runbook.
10. Review weekly reuse hypothesis and first-week aha moment.
11. Review free-tier cost risk.
12. Decide ready, not ready, or blocked.

## Decision Gate

First beta is allowed only if the audit finds no critical privacy leak, one leader can complete room creation and invite, one member can join and check in, and there is a basic plan for feedback and data deletion requests.

## Files To Update

- A filled copy of `superpowers/templates/privacy-risk-report.md`.
- A filled copy of `superpowers/templates/beta-test-runbook.md`.
- `docs/PRE_BETA_AUDIT.md` if the standing checklist changes.
- `docs/PROJECT_STATUS.md` only if project readiness status changes.

## Final Output Format

```md
## Pre-Beta Readiness Audit

Decision:
- Ready for first leader beta / Not ready / Blocked

Critical Blockers:
- ...

Privacy Risks:
- ...

Operational Gaps:
- ...

Retention Hypothesis:
- ...

Cost Risk:
- ...

Next Required Action:
- ...
```
