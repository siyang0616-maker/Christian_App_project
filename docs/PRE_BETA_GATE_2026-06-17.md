# Pre-Beta Gate - 2026-06-17

## Decision

Not ready for first real beta yet.

The app is healthier than yesterday: local verification passes and the public Vercel URL returns the real Donghaeng Room app. The remaining blockers are not broad product features. They are real-user beta gates:

1. Full public leader/member smoke test is not complete.
2. Full public leader/member smoke test still needs real accounts.
3. Visibility/edit/delete copy was narrowed after this gate because the old helper copy overpromised editability.

## Evidence Collected

### Local Verification

Command:

```bash
corepack pnpm verify
```

Result:

- Lint: pass
- Typecheck: pass
- Build: pass

### Public URL Basic Check

Target:

```text
https://christian-app-project.vercel.app/
```

Result:

- HTTP status: 200
- Page contains Donghaeng Room app copy: yes
- Page shows "Supabase connection needed" setup screen: no
- Page contains unauthenticated auth/start copy: yes

This confirms the production URL is reachable and no longer stuck on the Supabase setup notice.

## Role Reviews

### Developer

Status: pass with remaining manual QA.

- Code-level verification passes.
- Auth callback redirect safety exists in `app/auth/callback/route.ts`.
- Signup/login still needs real public testing with fresh email accounts.
- Do not change database schema unless the public smoke test finds a real blocker.

### Entrepreneur

Status: not ready to expand.

- The next validation question is still: will one leader want to use this again next week?
- Do not invite 3-5 leaders yet.
- First run should be 1 trusted leader and 2 members.
- Any fix must serve signup, invite, check-in, prayer memory, or leader care.

### Designer

Status: needs public mobile smoke test.

- The current UI is aimed at care, not surveillance.
- The first-use leader/member split is in place.
- Still needs phone testing for:
  - invite copy buttons
  - check-in success visibility
  - prayer card immediate display
  - visibility copy before submission

### Marketer

Status: copy is directionally ready.

- The message "대화는 카톡에서, 체크인과 기도제목 기록은 동행방에서" is aligned.
- The member ask should stay small: "오늘 체크인 한 번만 남겨봐 주세요."
- Avoid presenting Donghaeng Room as a chat app, board, Bible app, devotional app, or church admin tool.

### Beta Operator

Status: pass with remaining smoke test.

- Feedback assets exist.
- Manual QA checklist exists.
- Data deletion request handling is now documented in `docs/BETA_DATA_DELETION_RUNBOOK.md`.
- The beta operator still needs to run the full public leader/member test before inviting a real group.

### Privacy And Security

Status: pass with safeguards, not ready until verified.

- Prayer requests, moods, notes, membership, and visibility are sensitive.
- Public links must not leak private data.
- Anonymous prayer must hide author identity in UI.
- Private and leader-only content must be tested with at least 2 accounts.
- No service_role key should be used in Vercel or `.env.local`.

## Blocking Issues

### P0. Full Public Smoke Test Not Complete

Need to test on the public Vercel URL:

1. Leader signs up with a fresh email.
2. Leader confirms email.
3. Leader logs in.
4. Leader creates profile.
5. Leader creates room.
6. Leader copies invite message/code.
7. Member 1 signs up and joins with code.
8. Member 2 signs up and joins with code.
9. Member creates check-in.
10. Member creates prayer request.
11. Another member clicks "기도했어요".
12. Leader views dashboard.
13. Private/anonymous visibility is checked.

### P1. Visibility Copy Reviewed

The old helper copy said "공개 범위는 언제든 바꿀 수 있어요." Because prayer requests do not currently have a full edit UI, the app and docs now use safer copy:

```text
제출 전에 공개 범위를 꼭 확인해 주세요.
```

## Competitor Drift Review

- KakaoTalk: safe. Invite copy uses KakaoTalk as the place for conversation, not as a feature to replace.
- Naver BAND: safe. No feed, board, or general community feature added.
- YouVersion: safe. No Bible content or reading plan added.
- Hallow / Glorify / Pray.com: safe. No devotional media or AI prayer generation added.
- Planning Center / Church Center: watch. Leader dashboard must stay care-oriented and avoid attendance/admin wording.

## Cost Risk Review

Cost decision: safe for MVP.

- No realtime requirement.
- No storage or upload requirement.
- No AI or paid API requirement.
- No push, SMS, Kakao API, or analytics requirement.
- Current beta can run on existing Vercel and Supabase assumptions.

## Go / No-Go

Current decision:

```text
No-Go for external beta invite.
```

Allowed next action:

```text
Run the full public smoke test with controlled test accounts.
```

Do not build new product features until the full smoke test identifies a specific blocker.

## Next 3 Tasks

1. Execute the public 1-leader/2-member smoke test using `docs/QA_CHECKLIST.md`.
2. Patch only blockers found in that smoke test.
3. Invite one trusted leader only after the smoke test passes.
