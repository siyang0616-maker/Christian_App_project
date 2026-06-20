-- Repair a live Supabase project after only 001_initial_schema.sql was applied.
--
-- Safe to run more than once.
-- Use this when the app is deployed but the leader dashboard shows no check-ins
-- or prayers because later MVP migrations were not applied.

do $$
declare
  mood_labels text[];
begin
  select array_agg(e.enumlabel order by e.enumsortorder)
  into mood_labels
  from pg_type t
  join pg_enum e on e.enumtypid = t.oid
  join pg_namespace n on n.oid = t.typnamespace
  where n.nspname = 'public'
    and t.typname = 'checkin_mood';

  if mood_labels is not null
    and not (mood_labels @> array['good', 'normal', 'hard', 'need_prayer'])
  then
    drop type if exists public.checkin_mood_new;
    create type public.checkin_mood_new as enum ('good', 'normal', 'hard', 'need_prayer');

    alter table public.checkins
      alter column mood type public.checkin_mood_new
      using (
        case mood::text
          when 'peaceful' then 'good'
          when 'thankful' then 'good'
          when 'tired' then 'hard'
          else mood::text
        end
      )::public.checkin_mood_new;

    drop type public.checkin_mood;
    alter type public.checkin_mood_new rename to checkin_mood;
  end if;
end $$;

alter table public.checkins
  add column if not exists woke_up boolean not null default false,
  add column if not exists bible_read boolean not null default false,
  add column if not exists prayed boolean not null default false,
  add column if not exists meditated boolean not null default false,
  add column if not exists attended boolean not null default false;

alter table public.prayers
  add column if not exists answered_at timestamptz;

create index if not exists prayers_answered_at_idx
on public.prayers(group_id, answered_at desc)
where answered_at is not null;

create table if not exists public.leader_prayer_care_marks (
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

create index if not exists leader_prayer_care_marks_group_idx
on public.leader_prayer_care_marks(group_id, updated_at desc);

create index if not exists leader_prayer_care_marks_priority_idx
on public.leader_prayer_care_marks(group_id, is_important, is_ongoing)
where is_important or is_ongoing;

alter table public.leader_prayer_care_marks enable row level security;

drop policy if exists "leaders can view prayer care marks" on public.leader_prayer_care_marks;
drop policy if exists "leaders can upsert prayer care marks" on public.leader_prayer_care_marks;
drop policy if exists "leaders can update prayer care marks" on public.leader_prayer_care_marks;
drop policy if exists "leaders can delete prayer care marks" on public.leader_prayer_care_marks;

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

grant usage on schema public to authenticated;

grant select, insert, update, delete on table public.profiles to authenticated;
grant select, insert, update, delete on table public.groups to authenticated;
grant select, insert, update, delete on table public.group_members to authenticated;
grant select, insert, update, delete on table public.checkins to authenticated;
grant select, insert, update, delete on table public.prayers to authenticated;
grant select, insert, update, delete on table public.prayer_reactions to authenticated;
grant select, insert, update, delete on table public.leader_prayer_care_marks to authenticated;

grant execute on function public.join_group_by_code(text) to authenticated;
