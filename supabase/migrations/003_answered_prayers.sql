alter table public.prayers
  add column answered_at timestamptz;

create index prayers_answered_at_idx
on public.prayers(group_id, answered_at desc)
where answered_at is not null;
