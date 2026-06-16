# Pre-Beta Audit

Use this before sending Donghaeng Room to the first real small group leader.

Primary workflow:

- `superpowers/workflows/08_pre_beta_readiness_audit.md`

Supporting templates:

- `superpowers/templates/privacy-risk-report.md`
- `superpowers/templates/beta-test-runbook.md`

## Required Context

- Public beta URL:
- Supabase Auth redirect status:
- Test leader account:
- Test member account 1:
- Test member account 2:
- Current invite message:
- Feedback form or guide:
- Beta data deletion plan:

## Audit Steps

### 1. Public Access

- [ ] Public URL opens on mobile.
- [ ] Public URL is not localhost or `127.0.0.1`.
- [ ] Signup works.
- [ ] Email confirmation returns to the app.
- [ ] Login works after confirmation.

### 2. Leader Setup

- [ ] Leader creates profile.
- [ ] Leader creates room without help.
- [ ] Room creation success is obvious.
- [ ] Invite code is visible.
- [ ] Copy-ready invite message is available.

### 3. Member Setup

- [ ] Member receives beta link and invite code.
- [ ] Member signs up or logs in.
- [ ] Member creates profile.
- [ ] Member joins with invite code.
- [ ] Member reaches check-in screen within 2 minutes.

### 4. Core Loop

- [ ] Member submits check-in.
- [ ] Visibility is clear before check-in submission.
- [ ] Member submits prayer request.
- [ ] Visibility is clear before prayer submission.
- [ ] Anonymous prayer hides author name in UI.
- [ ] Another member can tap "기도했어요".
- [ ] Leader can see care-oriented dashboard.

### 5. Privacy Reality Check

- [ ] Prayer/check-in sensitivity is acknowledged.
- [ ] Private data does not appear in invite links.
- [ ] Private data does not appear in errors.
- [ ] Dashboard does not expose content outside visibility rules.
- [ ] RLS assumptions are known.
- [ ] Edit/delete limitations are known before beta.
- [ ] Data deletion request handling is documented.

### 6. Beta Operations

- [ ] Leader instructions are ready.
- [ ] Member instructions are ready.
- [ ] Feedback questions are ready.
- [ ] Support contact is clear.
- [ ] Known limitations are ready to explain.
- [ ] Go/no-go rule is written.

### 7. Cost Reality Check

- [ ] No new realtime requirement.
- [ ] No new storage/upload requirement.
- [ ] No AI or paid API requirement.
- [ ] No push, SMS, or Kakao API requirement.
- [ ] Works with current Vercel and Supabase free-tier MVP assumptions.

## Go/No-Go

Ready for first leader beta if:

- One leader can create a room and invite 2 members.
- One member can join and check in within 2 minutes.
- Prayer card and "기도했어요" work.
- Leader dashboard creates care value.
- No critical privacy leak is found.
- Feedback and data deletion handling are prepared.

Blocked if:

- Signup/login fails on public URL.
- Invite or join flow fails.
- Private or anonymous data can leak.
- There is no way to handle deletion requests.
- The test requires paid infrastructure or feature expansion.
