# Beta Data Deletion Runbook

## Purpose

This runbook explains how to handle beta participant data deletion requests before Donghaeng Room has a user-facing delete UI.

Use this only for the first small beta:

- 1 trusted leader
- 2 members
- 1 test group
- public Vercel URL

The goal is to protect trust while keeping the MVP small. Do not build a deletion dashboard before the first beta unless a real blocker appears.

## What Counts As Beta Data

Treat all of these as sensitive:

- profile display name
- group membership
- check-ins
- mood and rhythm fields
- check-in notes
- prayer requests
- anonymous prayer requests
- "기도했어요" reactions
- invite code and group membership context

Do not store real prayer content in GitHub issues, docs, screenshots, or external feedback forms.

## Operator Rules

1. Confirm the requester's email address.
2. Confirm the deletion scope before touching data.
3. Do not paste service_role keys into Vercel, `.env.local`, GitHub, chat, or docs.
4. Use the Supabase Dashboard only from the project owner/admin account.
5. Prefer deleting specific beta content before deleting an Auth user.
6. Be careful with leader accounts: deleting a leader Auth user can cascade-delete groups they created.
7. Keep a private local note that the request was completed, but do not commit personal data to the repo.

## Request Types

### Type A: Delete One Check-In

Use when a participant wants one check-in removed but wants to keep using the app.

Required confirmation:

```text
삭제할 체크인 날짜와 동행방 이름을 확인해 주세요.
```

### Type B: Delete One Prayer Request

Use when a participant wants one prayer request removed.

Required confirmation:

```text
삭제할 기도제목이 어느 동행방에 있는지 확인해 주세요.
기도제목 내용 전체를 외부 폼이나 채팅에 다시 적지 않아도 됩니다.
```

### Type C: Delete A Participant's Beta Content

Use when a participant wants their beta content removed but does not require Auth account deletion.

Deletes:

- their prayer reactions
- their prayer requests
- their check-ins
- their group memberships
- their profile row

Does not delete:

- other members' data
- the group itself
- the Supabase Auth user

### Type D: Delete Auth Account

Use only when the participant explicitly asks to delete their account.

Important:

- Supabase Auth user deletion can be done from Authentication > Users.
- Deleting an Auth user does not immediately invalidate already-issued JWTs; the existing token can remain valid until expiry.
- If the user created a group, deleting their Auth user can cascade-delete groups they created because `public.groups.created_by` references `auth.users(id) on delete cascade`.

For leader accounts, choose one of these first:

1. Delete the whole test group, if it was only for beta testing.
2. Keep the Auth user and delete only beta content.
3. Add a separate approved migration later to support ownership transfer. Do not do this before first beta unless needed.

### Type E: Delete Whole Test Group

Use when the first beta group should be removed entirely.

Deletes:

- group
- group memberships
- check-ins in that group
- prayer requests in that group
- prayer reactions on those prayer requests

Does not automatically delete:

- Auth users
- profile rows, unless those users are also deleted separately

## Where To Work

Supabase project:

```text
vguvxpvysodugauaxfxz
```

Use:

- Supabase Dashboard > Table Editor for inspection
- Supabase Dashboard > SQL Editor for controlled deletes
- Supabase Dashboard > Authentication > Users only when Auth account deletion is explicitly requested

Do not run deletion SQL from the app or from client-side code.

## Step 1: Identify The User

In Supabase SQL Editor:

```sql
select id, email, created_at
from auth.users
where lower(email) = lower('participant@example.com');
```

Copy the `id` value. Use it as `TARGET_USER_ID` in the sections below.

## Step 2: Preflight Counts

Run this before deleting anything:

```sql
select 'profiles' as table_name, count(*) from public.profiles where id = 'TARGET_USER_ID'
union all
select 'group_members', count(*) from public.group_members where user_id = 'TARGET_USER_ID'
union all
select 'checkins', count(*) from public.checkins where user_id = 'TARGET_USER_ID'
union all
select 'prayers', count(*) from public.prayers where user_id = 'TARGET_USER_ID'
union all
select 'prayer_reactions', count(*) from public.prayer_reactions where user_id = 'TARGET_USER_ID'
union all
select 'groups_created', count(*) from public.groups where created_by = 'TARGET_USER_ID';
```

If `groups_created` is greater than `0`, pause before deleting the Auth user.

## Step 3: Delete A Participant's Beta Content

Use this for Type C requests.

```sql
begin;

delete from public.prayer_reactions
where user_id = 'TARGET_USER_ID';

delete from public.prayers
where user_id = 'TARGET_USER_ID';

delete from public.checkins
where user_id = 'TARGET_USER_ID';

delete from public.group_members
where user_id = 'TARGET_USER_ID';

delete from public.profiles
where id = 'TARGET_USER_ID';

commit;
```

Then rerun the preflight counts to confirm the participant's public beta content is gone.

## Step 4: Delete A Single Check-In

Use this for Type A requests.

First find the row:

```sql
select c.id, c.group_id, g.name as group_name, c.checkin_date, c.created_at
from public.checkins c
join public.groups g on g.id = c.group_id
where c.user_id = 'TARGET_USER_ID'
order by c.checkin_date desc, c.created_at desc;
```

Then delete the selected row:

```sql
delete from public.checkins
where id = 'CHECKIN_ID';
```

## Step 5: Delete A Single Prayer Request

Use this for Type B requests.

First find likely rows without copying prayer content into external tools:

```sql
select p.id, p.group_id, g.name as group_name, p.visibility, p.created_at
from public.prayers p
join public.groups g on g.id = p.group_id
where p.user_id = 'TARGET_USER_ID'
order by p.created_at desc;
```

Then delete the selected row:

```sql
delete from public.prayers
where id = 'PRAYER_ID';
```

`public.prayer_reactions` for that prayer will be deleted by cascade.

## Step 6: Delete A Whole Test Group

Use this only for Type E requests or internal cleanup after a test group is no longer needed.

Find the group:

```sql
select id, name, invite_code, created_by, created_at
from public.groups
where invite_code = upper(trim('INVITE_CODE'));
```

Preflight:

```sql
select 'members' as item, count(*) from public.group_members where group_id = 'GROUP_ID'
union all
select 'checkins', count(*) from public.checkins where group_id = 'GROUP_ID'
union all
select 'prayers', count(*) from public.prayers where group_id = 'GROUP_ID'
union all
select 'prayer_reactions', count(*)
from public.prayer_reactions pr
where exists (
  select 1
  from public.prayers p
  where p.id = pr.prayer_id
    and p.group_id = 'GROUP_ID'
);
```

Delete:

```sql
delete from public.groups
where id = 'GROUP_ID';
```

Group memberships, check-ins, prayers, and prayer reactions for that group should be removed by cascade.

## Step 7: Delete Auth User Only If Explicitly Requested

Only do this after content deletion has been considered.

Dashboard path:

```text
Supabase Dashboard > Authentication > Users > select user > Delete user
```

Before deleting:

- Confirm the email.
- Confirm whether the user created any groups.
- Confirm that deleting the Auth user is really requested.

After deleting:

- Ask the participant to refresh/sign out.
- Note that already-issued sessions may remain valid until JWT expiry.

## Completion Message

Use a calm, non-technical message:

```text
요청하신 베타 데이터를 삭제 처리했어요.
동행방 베타를 함께 확인해 주셔서 감사합니다.
혹시 화면에 이전 내용이 남아 보이면 새로고침하거나 다시 로그인해 주세요.
```

If only content was deleted and the account remains:

```text
요청하신 체크인/기도제목 데이터를 삭제했어요.
계정 자체는 남아 있어서 원하시면 다시 로그인해 사용할 수 있어요.
```

## Do Not Do

- Do not collect real prayer content in a Google Form.
- Do not paste service_role keys into Vercel.
- Do not delete a leader Auth user before checking whether they created the group.
- Do not invite more beta groups until the deletion process has been tested on a dummy account or dummy group.
- Do not build a full admin dashboard for deletion before first beta evidence.

## First Beta Acceptance Criteria

This runbook is enough for the first beta when:

- The operator can identify a user by email.
- The operator can delete one check-in.
- The operator can delete one prayer request.
- The operator can delete a participant's beta content.
- The operator understands the risk of deleting leader Auth users.
- The operator does not need a new app feature to handle the first deletion request.

