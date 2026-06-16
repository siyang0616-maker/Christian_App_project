# QA Checklist

Use this checklist before inviting the first real beta group.

Target beta:

- 1 small group leader
- 2 members
- Public Vercel URL
- Mobile browser first

Decision:

- Ready only when all P0 checks pass.
- Not ready if signup, invite, check-in, prayer, privacy, or leader dashboard fails.

## Test Setup

- [ ] Public beta URL:
- [ ] The URL is not `localhost` or `127.0.0.1`.
- [ ] Leader test email:
- [ ] Member 1 test email:
- [ ] Member 2 test email:
- [ ] Supabase Auth redirect URL includes `/auth/callback`.
- [ ] Feedback guide or form links are ready.
- [ ] Beta data deletion request process is known.

## P0: Leader Onboarding

- [ ] Open public beta URL on a phone.
- [ ] Sign up as leader.
- [ ] Confirm email and return to the app.
- [ ] Log in as leader.
- [ ] Create profile name.
- [ ] Confirm the no-group screen clearly shows `리더라면 방 만들기`.
- [ ] Create a room without help.
- [ ] Confirm room creation does not silently fail.
- [ ] Confirm leader reaches the room view.
- [ ] Confirm invite code is visible.
- [ ] Confirm copy-ready invite message is visible.

Pass:

- Leader can create a room and find invite information without operator help.

Fail:

- Leader cannot sign up, confirm email, create profile, create room, or find invite code/message.

## P0: Member Onboarding

- [ ] Send invite message and invite code to Member 1.
- [ ] Member 1 opens the public beta URL on a phone.
- [ ] Member 1 signs up or logs in.
- [ ] Member 1 creates profile name.
- [ ] Confirm the no-group screen clearly shows `멤버라면 초대코드 입력`.
- [ ] Member 1 enters invite code.
- [ ] Member 1 reaches the check-in flow within 2 minutes.
- [ ] Repeat with Member 2.

Pass:

- Both members can join the room with the invite code.

Fail:

- Invite code is confusing, invalid code errors are unclear, or a member cannot reach check-in.

## P0: Daily Check-In Flow

- [ ] Member 1 completes today's check-in.
- [ ] Member 1 sees a clear success state.
- [ ] Member 1 can understand visibility before submission.
- [ ] Member 2 completes today's check-in.
- [ ] Leader can see allowed check-in information.
- [ ] Private check-in content does not appear to other members.
- [ ] Leader-only check-in content does not appear to non-leader members.

Pass:

- Members can complete check-in quickly, and visibility behaves as expected.

Fail:

- Check-in save fails, success is unclear, or private/leader-only data leaks.

## P0: Prayer Request Flow

- [ ] Member 1 creates a prayer request.
- [ ] Member 1 sees a clear success state.
- [ ] Member 1 can understand visibility before submission.
- [ ] Member 2 creates a prayer request.
- [ ] Another visible member prayer can receive `기도했어요`.
- [ ] Duplicate `기도했어요` does not create confusing repeated reactions.
- [ ] Anonymous prayer shows `익명` instead of author name.
- [ ] Private prayer does not appear to other members.
- [ ] Leader-only prayer does not appear to non-leader members.

Pass:

- Prayer cards and `기도했어요` work without privacy leaks.

Fail:

- Prayer save fails, anonymous author leaks, or private/leader-only prayer content leaks.

## P0: Failure Cases

- [ ] Invalid invite code shows a safe Korean error.
- [ ] Empty room name shows a safe Korean error.
- [ ] Missing check-in mood or invalid visibility shows a safe Korean error.
- [ ] Empty prayer request shows a safe Korean error.
- [ ] Invalid prayer reaction target shows a safe Korean error.
- [ ] Unsafe auth callback redirect attempt does not leave the app domain.
- [ ] No raw Supabase, SQL, token, or stack trace appears in user-facing messages.

Pass:

- Failed actions are understandable and safe.

Fail:

- A failed action silently does nothing, exposes technical details, or redirects off-site.

## P0: Leader Dashboard

- [ ] Leader sees care-oriented dashboard after members check in.
- [ ] Dashboard wording does not feel like attendance tracking.
- [ ] Dashboard does not use surveillance language.
- [ ] Dashboard respects visibility rules.
- [ ] Leader can identify prayer/care follow-up without seeing data they should not see.

Pass:

- Dashboard helps leader care without making members feel monitored.

Fail:

- Dashboard feels like scoring, attendance, ranking, or surveillance.

## P1: Mobile Usability

- [ ] First-use screen fits on mobile width without overlap.
- [ ] Create room form is easy to complete.
- [ ] Invite code entry is easy to complete.
- [ ] Check-in can be completed in about 20 seconds.
- [ ] Prayer form is readable and usable.
- [ ] Copy buttons are tappable.

## P1: Beta Operations

- [ ] Leader knows this is a 1-week beta.
- [ ] Members know participation is low-pressure.
- [ ] Feedback forms are ready.
- [ ] Known limitations are ready to explain.
- [ ] Operator knows how to receive deletion requests.

## Blocking Issue Log

Use this format for every blocker:

- Area:
- Account:
- Steps to reproduce:
- Expected:
- Actual:
- Screenshot or note:
- Decision: fix before beta / defer / remove from scope

## Final QA Decision

- [ ] Ready for first beta
- [ ] Not ready
- [ ] Blocked by public URL/auth/dependency/environment

Notes:

-
