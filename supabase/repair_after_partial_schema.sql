-- Use this only if the main schema stopped around:
-- create function public.is_group_leader(...)
-- ERROR: 42P13: no function body specified

create or replace function public.is_group_leader(target_group_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.group_members
    where group_id = target_group_id
      and user_id = auth.uid()
      and role = 'leader'
  );
$$;

create or replace function public.is_group_creator(target_group_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.groups
    where id = target_group_id
      and created_by = auth.uid()
  );
$$;

create or replace function public.shares_group_with(target_user_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.group_members mine
    join public.group_members theirs on theirs.group_id = mine.group_id
    where mine.user_id = auth.uid()
      and theirs.user_id = target_user_id
  );
$$;

create or replace function public.can_view_checkin(target_checkin public.checkins)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select
    target_checkin.user_id = auth.uid()
    or (
      target_checkin.visibility = 'group'
      and public.is_group_member(target_checkin.group_id)
    )
    or (
      target_checkin.visibility = 'leader'
      and public.is_group_leader(target_checkin.group_id)
    );
$$;

create or replace function public.can_view_prayer(target_prayer public.prayers)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select
    target_prayer.user_id = auth.uid()
    or (
      target_prayer.visibility in ('group', 'anonymous')
      and public.is_group_member(target_prayer.group_id)
    )
    or (
      target_prayer.visibility = 'leader'
      and public.is_group_leader(target_prayer.group_id)
    );
$$;

create or replace function public.join_group_by_code(raw_invite_code text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  target_group_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  select id
  into target_group_id
  from public.groups
  where invite_code = upper(trim(raw_invite_code));

  if target_group_id is null then
    raise exception 'Invalid invite code';
  end if;

  insert into public.group_members (group_id, user_id, role)
  values (target_group_id, auth.uid(), 'member')
  on conflict (group_id, user_id) do nothing;

  return target_group_id;
end;
$$;

grant execute on function public.join_group_by_code(text) to authenticated;

drop policy if exists "profiles are visible to owner and shared group members" on public.profiles;
drop policy if exists "users can insert own profile" on public.profiles;
drop policy if exists "users can update own profile" on public.profiles;
drop policy if exists "members can view their groups" on public.groups;
drop policy if exists "authenticated users can create groups" on public.groups;
drop policy if exists "members can view group membership" on public.group_members;
drop policy if exists "group creators can add themselves as leader" on public.group_members;
drop policy if exists "members can view allowed checkins" on public.checkins;
drop policy if exists "members can create own checkins" on public.checkins;
drop policy if exists "authors can update own checkins" on public.checkins;
drop policy if exists "members can view allowed prayers" on public.prayers;
drop policy if exists "members can create own prayers" on public.prayers;
drop policy if exists "authors can update own prayers" on public.prayers;
drop policy if exists "members can view reactions on visible prayers" on public.prayer_reactions;
drop policy if exists "members can add own prayer reactions" on public.prayer_reactions;

create policy "profiles are visible to owner and shared group members"
on public.profiles for select
to authenticated
using (
  id = auth.uid()
  or public.shares_group_with(id)
);

create policy "users can insert own profile"
on public.profiles for insert
to authenticated
with check (id = auth.uid());

create policy "users can update own profile"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "members can view their groups"
on public.groups for select
to authenticated
using (
  public.is_group_member(id)
  or created_by = auth.uid()
);

create policy "authenticated users can create groups"
on public.groups for insert
to authenticated
with check (created_by = auth.uid());

create policy "members can view group membership"
on public.group_members for select
to authenticated
using (public.is_group_member(group_id));

create policy "group creators can add themselves as leader"
on public.group_members for insert
to authenticated
with check (
  user_id = auth.uid()
  and role = 'leader'
  and public.is_group_creator(group_id)
);

create policy "members can view allowed checkins"
on public.checkins for select
to authenticated
using (public.can_view_checkin(checkins));

create policy "members can create own checkins"
on public.checkins for insert
to authenticated
with check (
  user_id = auth.uid()
  and public.is_group_member(group_id)
);

create policy "authors can update own checkins"
on public.checkins for update
to authenticated
using (user_id = auth.uid())
with check (
  user_id = auth.uid()
  and public.is_group_member(group_id)
);

create policy "members can view allowed prayers"
on public.prayers for select
to authenticated
using (public.can_view_prayer(prayers));

create policy "members can create own prayers"
on public.prayers for insert
to authenticated
with check (
  user_id = auth.uid()
  and public.is_group_member(group_id)
);

create policy "authors can update own prayers"
on public.prayers for update
to authenticated
using (user_id = auth.uid())
with check (
  user_id = auth.uid()
  and public.is_group_member(group_id)
);

create policy "members can view reactions on visible prayers"
on public.prayer_reactions for select
to authenticated
using (
  exists (
    select 1
    from public.prayers p
    where p.id = prayer_reactions.prayer_id
      and public.can_view_prayer(p)
  )
);

create policy "members can add own prayer reactions"
on public.prayer_reactions for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.prayers p
    where p.id = prayer_reactions.prayer_id
      and public.can_view_prayer(p)
  )
);
