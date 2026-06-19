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

create index leader_prayer_care_marks_group_idx
on public.leader_prayer_care_marks(group_id, updated_at desc);

create index leader_prayer_care_marks_priority_idx
on public.leader_prayer_care_marks(group_id, is_important, is_ongoing)
where is_important or is_ongoing;

alter table public.leader_prayer_care_marks enable row level security;

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
