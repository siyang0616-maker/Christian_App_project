# Risk Register

## Open Risks

### R1: Public Beta Flow Not Fully Verified

- Status: Open
- Severity: High
- Risk: The app may fail during signup, email confirmation, invite, check-in, prayer, or dashboard use on the public URL.
- Mitigation: Complete the full public 1-leader/2-member smoke test using `docs/QA_CHECKLIST.md`.

### R4: Email Confirmation Friction

- Status: Open
- Severity: High
- Risk: Korean beta users may fail to confirm email, reset passwords, log in on phone Safari, or return to the app.
- Evidence: Phone/public testing hit Supabase `invalid_credentials`, password reset requests hit `over_email_send_rate_limit` / HTTP 429, and the dashboard could not save the `Confirm email` toggle because `api.supabase.com` failed to fetch.
- Mitigation: Do not block MVP development on SMTP first. Restore local testability with fresh confirmed test users, then retest the public phone flow with one leader and one member.

### R8: Auth Debugging Can Consume MVP Time

- Status: Open
- Severity: High
- Risk: Repeated Supabase dashboard, SMTP, and email-template troubleshooting can stall the core MVP validation question.
- Mitigation: Timebox Auth operations. If email confirmation blocks testing, use confirmed internal test accounts for development and return to email deliverability only before public beta invites.

### R5: Leader Dashboard Could Feel Like Monitoring

- Status: Watch
- Severity: Medium
- Risk: Dashboard metrics may feel like attendance tracking if copy or beta framing is wrong.
- Mitigation: Use care language and collect leader/member feedback.

### R7: Group Creation Is Not Transactional

- Status: Watch
- Severity: Medium
- Risk: Group creation and leader membership insertion are still two separate Supabase writes. Error handling is safer, but strict atomicity is not guaranteed.
- Mitigation: Keep as-is for MVP unless QA finds a real partial-create issue; consider a separately approved RPC only if needed.

## Closed Risks

### R2: Beta Data Deletion Handling Not Defined

- Status: Closed on 2026-06-17
- Evidence: `docs/BETA_DATA_DELETION_RUNBOOK.md` defines manual Supabase deletion handling for the first beta.
- Residual risk: deletion SQL must be used carefully, especially for leader accounts that created groups.

### R3: Visibility Copy May Overpromise Editability

- Status: Closed on 2026-06-17
- Evidence: App and docs now use "제출 전에 공개 범위를 꼭 확인해 주세요" instead of promising visibility can always be changed.
- Residual risk: the full public smoke test still needs to confirm members understand visibility before submitting check-ins and prayers.

### R6: Local Verification Environment Not Ready

- Status: Closed on 2026-06-17
- Evidence: `corepack pnpm verify` passed lint, typecheck, and build.
