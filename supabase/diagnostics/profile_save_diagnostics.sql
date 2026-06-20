-- Profile save diagnostics for Donghaeng Room.
-- Run this in the Supabase SQL Editor for the same project used by Vercel.
--
-- Expected result:
-- - public.profiles exists.
-- - RLS is enabled on public.profiles.
-- - authenticated has SELECT, INSERT, UPDATE, DELETE on public.profiles.
-- - own-profile insert/update policies exist.
--
-- Optional:
-- Replace the email value below with the blocked test user's email to confirm
-- that the Auth user exists and whether a profile row was created.

with required_tables(table_name) as (
  values
    ('profiles'),
    ('groups'),
    ('group_members'),
    ('checkins'),
    ('prayers'),
    ('prayer_reactions'),
    ('leader_prayer_care_marks')
),
table_refs as (
  select
    table_name,
    to_regclass('public.' || table_name) as relid
  from required_tables
)
select
  table_name,
  relid is not null as table_exists,
  coalesce((
    select c.relrowsecurity
    from pg_class c
    where c.oid = table_refs.relid
  ), false) as rls_enabled,
  case when relid is null then false else has_table_privilege('authenticated', relid, 'SELECT') end as authenticated_select,
  case when relid is null then false else has_table_privilege('authenticated', relid, 'INSERT') end as authenticated_insert,
  case when relid is null then false else has_table_privilege('authenticated', relid, 'UPDATE') end as authenticated_update,
  case when relid is null then false else has_table_privilege('authenticated', relid, 'DELETE') end as authenticated_delete
from table_refs
order by table_name;

select
  schemaname,
  tablename,
  policyname,
  cmd,
  roles
from pg_policies
where schemaname = 'public'
  and tablename = 'profiles'
order by policyname;

select
  has_function_privilege('authenticated', 'public.join_group_by_code(text)', 'EXECUTE') as authenticated_can_execute_join_group_by_code;

-- Optional Auth/profile row check.
-- Replace the email and run this block separately if needed.
--
-- with target_user as (
--   select id, email, email_confirmed_at is not null as email_confirmed, created_at
--   from auth.users
--   where email = 'PASTE_TEST_USER_EMAIL_HERE'
-- )
-- select * from target_user;
--
-- with target_user as (
--   select id
--   from auth.users
--   where email = 'PASTE_TEST_USER_EMAIL_HERE'
-- )
-- select profiles.*
-- from public.profiles
-- join target_user on target_user.id = profiles.id;
