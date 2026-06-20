create extension if not exists pgcrypto;

create type public.member_role as enum ('leader', 'member');
create type public.checkin_visibility as enum ('private', 'leader', 'group');
create type public.prayer_visibility as enum ('private', 'leader', 'group', 'anonymous');
create type public.checkin_mood as enum ('good', 'normal', 'hard', 'need_prayer');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 30),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.groups (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 40),
  invite_code text not null unique check (char_length(invite_code) between 4 and 10),
  created_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.group_members (
  group_id uuid not null references public.groups(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.member_role not null default 'member',
  joined_at timestamptz not null default now(),
  primary key (group_id, user_id)
);

create table public.checkins (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  checkin_date date not null default current_date,
  mood public.checkin_mood not null,
  woke_up boolean not null default false,
  bible_read boolean not null default false,
  prayed boolean not null default false,
  meditated boolean not null default false,
  attended boolean not null default false,
  note text check (note is null or char_length(note) <= 240),
  visibility public.checkin_visibility not null default 'group',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (group_id, user_id, checkin_date)
);

create table public.prayers (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null check (char_length(content) between 1 and 500),
  visibility public.prayer_visibility not null default 'group',
  answered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.prayer_reactions (
  prayer_id uuid not null references public.prayers(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (prayer_id, user_id)
);

create table public.leader_prayer_care_marks (
  prayer_id uuid primary key references public.prayers(id) on delete cascade,
  group_id uuid not null references public.groups(id) on delete cascade,
  care_scope text not null check (care_scope in ('communal', 'personal')),
  is_important boolean not null default false,
  is_ongoing boolean not null default true,
  created_by uuid not null references auth.users(id) on delete cascade,
  updated_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index group_members_user_id_idx on public.group_members(user_id);
create index checkins_group_date_idx on public.checkins(group_id, checkin_date desc);
create index prayers_group_created_idx on public.prayers(group_id, created_at desc);
create index prayers_answered_at_idx on public.prayers(group_id, answered_at desc) where answered_at is not null;
create index prayer_reactions_user_id_idx on public.prayer_reactions(user_id);
create index leader_prayer_care_marks_group_idx on public.leader_prayer_care_marks(group_id, updated_at desc);
create index leader_prayer_care_marks_priority_idx on public.leader_prayer_care_marks(group_id, is_important, is_ongoing) where is_important or is_ongoing;

alter table public.profiles enable row level security;
alter table public.groups enable row level security;
alter table public.group_members enable row level security;
alter table public.checkins enable row level security;
alter table public.prayers enable row level security;
alter table public.prayer_reactions enable row level security;
alter table public.leader_prayer_care_marks enable row level security;

create function public.is_group_member(target_group_id uuid)
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
  );
$$;

create function public.is_group_leader(target_group_id uuid)
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

create function public.is_group_creator(target_group_id uuid)
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

create function public.shares_group_with(target_user_id uuid)
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

create function public.can_view_checkin(target_checkin public.checkins)
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

create function public.can_view_prayer(target_prayer public.prayers)
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

create function public.join_group_by_code(raw_invite_code text)
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

grant usage on schema public to authenticated;

grant select, insert, update, delete on table public.profiles to authenticated;
grant select, insert, update, delete on table public.groups to authenticated;
grant select, insert, update, delete on table public.group_members to authenticated;
grant select, insert, update, delete on table public.checkins to authenticated;
grant select, insert, update, delete on table public.prayers to authenticated;
grant select, insert, update, delete on table public.prayer_reactions to authenticated;
grant select, insert, update, delete on table public.leader_prayer_care_marks to authenticated;

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

create policy "leaders can view prayer care marks"
on public.leader_prayer_care_marks for select
to authenticated
using (
  exists (
    select 1
    from public.prayers p
    where p.id = leader_prayer_care_marks.prayer_id
      and p.group_id = leader_prayer_care_marks.group_id
      and public.is_group_leader(p.group_id)
      and public.can_view_prayer(p)
  )
);

create policy "leaders can upsert prayer care marks"
on public.leader_prayer_care_marks for insert
to authenticated
with check (
  created_by = auth.uid()
  and updated_by = auth.uid()
  and exists (
    select 1
    from public.prayers p
    where p.id = leader_prayer_care_marks.prayer_id
      and p.group_id = leader_prayer_care_marks.group_id
      and public.is_group_leader(p.group_id)
      and public.can_view_prayer(p)
  )
);

create policy "leaders can update prayer care marks"
on public.leader_prayer_care_marks for update
to authenticated
using (
  exists (
    select 1
    from public.prayers p
    where p.id = leader_prayer_care_marks.prayer_id
      and p.group_id = leader_prayer_care_marks.group_id
      and public.is_group_leader(p.group_id)
      and public.can_view_prayer(p)
  )
)
with check (
  updated_by = auth.uid()
  and exists (
    select 1
    from public.prayers p
    where p.id = leader_prayer_care_marks.prayer_id
      and p.group_id = leader_prayer_care_marks.group_id
      and public.is_group_leader(p.group_id)
      and public.can_view_prayer(p)
  )
);

create policy "leaders can delete prayer care marks"
on public.leader_prayer_care_marks for delete
to authenticated
using (
  exists (
    select 1
    from public.prayers p
    where p.id = leader_prayer_care_marks.prayer_id
      and p.group_id = leader_prayer_care_marks.group_id
      and public.is_group_leader(p.group_id)
      and public.can_view_prayer(p)
  )
);
