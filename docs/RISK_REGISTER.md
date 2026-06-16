# Risk Register

## Open Risks

### R1: Public Beta Flow Not Fully Verified

- Status: Open
- Severity: High
- Risk: The app may fail during signup, email confirmation, invite, check-in, prayer, or dashboard use on the public URL.
- Mitigation: Run `superpowers/commands/pre-beta.md` and complete public Vercel smoke test.

### R2: Beta Data Deletion Handling Not Defined

- Status: Open
- Severity: High
- Risk: A beta participant may ask to delete prayer/check-in/profile/group data before there is a clear operator process.
- Mitigation: Define manual Supabase deletion request handling before first beta.

### R3: Visibility Copy May Overpromise Editability

- Status: Open
- Severity: Medium
- Risk: Visibility copy may imply edit support that is limited for prayer requests.
- Mitigation: Align copy with actual edit/delete capabilities before beta and verify with `docs/QA_CHECKLIST.md`.

### R4: Email Confirmation Friction

- Status: Open
- Severity: Medium
- Risk: Korean beta users may fail to confirm email or return to the app.
- Mitigation: Test Naver/Gmail flows on public URL.

### R5: Leader Dashboard Could Feel Like Monitoring

- Status: Watch
- Severity: Medium
- Risk: Dashboard metrics may feel like attendance tracking if copy or beta framing is wrong.
- Mitigation: Use care language and collect leader/member feedback.

### R6: Local Verification Environment Not Ready

- Status: Open
- Severity: High
- Risk: `pnpm`, local dependencies, lint, typecheck, and build could not be run in this session, so code correctness is not fully verified.
- Mitigation: Install or restore dependencies on a writable local environment, then run `pnpm lint`, `pnpm typecheck`, and `pnpm build` before merge or beta.

### R7: Group Creation Is Not Transactional

- Status: Watch
- Severity: Medium
- Risk: Group creation and leader membership insertion are still two separate Supabase writes. Error handling is safer, but strict atomicity is not guaranteed.
- Mitigation: Keep as-is for MVP unless QA finds a real partial-create issue; consider a separately approved RPC only if needed.

## Closed Risks

- None yet.
