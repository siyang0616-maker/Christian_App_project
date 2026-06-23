-- Care Thread v0
-- A lightweight, async leader-member care channel attached to an existing
-- check-in or prayer request. This is NOT a chat product:
-- - no read receipts
-- - no typing indicators
-- - no realtime subscriptions
-- - no media/file attachments
-- - no push notifications
-- Members see and can reply only inside their own thread.
-- Leaders see threads across the whole group.

create table public.care_messages (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  parent_type text not null check (parent_type in ('checkin', 'prayer')),
  parent_id uuid not null,
  thread_owner_id uuid not null references auth.users(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 500),
  created_at timestamptz not null default now()
);

-- thread_owner_id is always the member who owns the check-in/prayer this
-- thread is attached to, regardless of whether the leader or the member
-- wrote a given message. This lets both sides query "my thread" /
-- "this member's thread" with one simple predicate instead of joining
-- back into checkins/prayers every time.

create index care_messages_thread_idx
on public.care_messages(group_id, parent_type, parent_id, created_at);

create index care_messages_owner_idx
on public.care_messages(group_id, thread_owner_id, created_at desc);

alter table public.care_messages enable row level security;

-- A member can see a thread if they are the thread owner.
-- A leader can see any thread in a group they lead.
create policy "thread participants can view care messages"
on public.care_messages for select
to authenticated
using (
  thread_owner_id = auth.uid()
  or public.is_group_leader(group_id)
);

-- A member can only post into their own thread.
-- A leader can post into any thread in a group they lead.
-- Either way, sender_id must be the caller (no posting as someone else).
create policy "thread participants can send care messages"
on public.care_messages for insert
to authenticated
with check (
  sender_id = auth.uid()
  and (
    thread_owner_id = auth.uid()
    or public.is_group_leader(group_id)
  )
  and public.is_group_member(group_id)
);

-- No update/delete policy on purpose: messages are append-only, like a
-- paper trail of care conversations. If a correction is needed later,
-- add a soft-delete column in a follow-up migration instead of opening
-- update/delete here.
