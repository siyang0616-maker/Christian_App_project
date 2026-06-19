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
- Today this is a manual UX/privacy smoke check only. Do not run a schema/RLS deep dive in this pass.

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
- [ ] Confirm the room view starts with prayer cards and the prayer request form.
- [ ] Confirm leader care summary/signals appear before the leader's personal check-in.
- [ ] Confirm the invite section is below the prayer, care, and check-in areas.
- [ ] Confirm the invite section stays collapsed at the bottom by default.
- [ ] Open the invite section and confirm invite code/copy controls are visible.

Pass:

- Leader can create a room, see prayer/care value first, and find invite information at the bottom without operator help.

Fail:

- Leader cannot sign up, confirm email, create profile, create room, understand the first screen, or find invite code/message.

## P0: Member Onboarding

- [ ] Send invite message and invite code to Member 1.
- [ ] Member 1 opens the public beta URL on a phone.
- [ ] Member 1 signs up or logs in.
- [ ] Member 1 creates profile name.
- [ ] Confirm the no-group screen clearly shows `멤버라면 초대코드 입력`.
- [ ] Member 1 enters invite code.
- [ ] Member 1 reaches the check-in flow within 2 minutes.
- [ ] Confirm Member 1's room view starts with prayer cards and the prayer request form.
- [ ] Repeat with Member 2.

Pass:

- Both members can join the room with the invite code.

Fail:

- Invite code is confusing, invalid code errors are unclear, or a member cannot reach check-in.

## P0: Prayer Request Flow

- [ ] Member 1 creates a prayer request from the top prayer form.
- [ ] Member 1 sees a clear success state.
- [ ] Member 1 can understand visibility before submission: `소그룹 전체`, `리더와 나`, `나만 보기`, `이름 숨김`.
- [ ] Member 1 creates one `리더와 나` prayer.
- [ ] Member 2 cannot see Member 1's `리더와 나` prayer.
- [ ] Member 2 creates one `소그룹 전체` prayer.
- [ ] Another visible member prayer can receive `기도했어요`.
- [ ] Duplicate `기도했어요` does not create confusing repeated reactions.
- [ ] A prayer submitted with `이름 숨김` shows `이름 숨김` instead of the author name.
- [ ] Private prayer does not appear to other members.

Pass:

- Prayer cards, the prayer form, visibility labels, and `기도했어요` work without visible privacy leaks.

Fail:

- Prayer save fails, success is unclear, hidden-name author leaks, or private/leader-only prayer content leaks.

## P0: Daily Check-In Flow

- [ ] Member 1 completes today's check-in.
- [ ] Member 1 sees a clear success state.
- [ ] Member 1 can understand visibility before submission: `소그룹 전체`, `리더와 나`, `나만 보기`.
- [ ] Member 2 completes today's check-in.
- [ ] Leader can see allowed check-in information.
- [ ] Private check-in content does not appear to other members.
- [ ] `리더와 나` check-in content does not appear to non-leader members.

Pass:

- Members can complete check-in quickly, and visibility behaves as expected.

Fail:

- Check-in save fails, success is unclear, or private/leader-only data leaks.

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

## P0: Leader Care Signals

- [ ] Leader sees care-oriented summary/signals after members add prayers and check-ins.
- [ ] Home leader summary appears after prayer cards/form and before personal check-in.
- [ ] Leader can open `/leader` from the leader care entry point.
- [ ] `/leader` shows care-oriented signals without attendance, scoring, ranking, or surveillance language.
- [ ] Leader can identify prayer/care follow-up from visible prayer cards.
- [ ] Leader can mark a visible prayer as `함께 기도` or `개별 돌봄`.
- [ ] Leader can toggle `중요` and `계속 기억`.
- [ ] Saved care signals still show after returning to `/leader`.
- [ ] Member-facing prayer cards do not show leader-only care labels.
- [ ] Manual privacy check only: if visible data looks wrong, log it as a blocker and hand to the security/privacy lane.

Pass:

- Leader care signals help the leader remember follow-up without making members feel monitored.

Fail:

- Dashboard feels like scoring, attendance, ranking, surveillance, or exposes leader-only care labels to members.

## P1: Mobile Usability

- [ ] First-use screen fits on mobile width without overlap.
- [ ] Joined room starts with prayer cards/form first on mobile.
- [ ] Create room form is easy to complete.
- [ ] Invite code entry is easy to complete.
- [ ] Invite section stays at the bottom and longer invite message starts collapsed.
- [ ] Check-in can be completed in about 20 seconds.
- [ ] Prayer form is readable and usable.
- [ ] Visibility labels fit clearly, including `리더와 나` and prayer-only `이름 숨김`.
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
