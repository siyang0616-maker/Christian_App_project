-- Supabase projects created after the 2026 Data API exposure change may not
-- expose public tables to authenticated users automatically.
-- RLS still controls which rows authenticated users can read or write.

grant usage on schema public to authenticated;

grant select, insert, update, delete on table public.profiles to authenticated;
grant select, insert, update, delete on table public.groups to authenticated;
grant select, insert, update, delete on table public.group_members to authenticated;
grant select, insert, update, delete on table public.checkins to authenticated;
grant select, insert, update, delete on table public.prayers to authenticated;
grant select, insert, update, delete on table public.prayer_reactions to authenticated;
grant select, insert, update, delete on table public.leader_prayer_care_marks to authenticated;

grant execute on function public.join_group_by_code(text) to authenticated;
