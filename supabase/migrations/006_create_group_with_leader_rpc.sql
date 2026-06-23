create or replace function public.create_group_with_leader(group_name text)
returns table (
  group_id uuid,
  created_group_name text,
  group_invite_code text
)
language plpgsql
set search_path = public
as $$
declare
  cleaned_name text := trim(group_name);
  new_group_id uuid;
  new_invite_code text;
  alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  attempt_count integer := 0;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if cleaned_name is null or char_length(cleaned_name) < 1 or char_length(cleaned_name) > 40 then
    raise exception 'Invalid group name';
  end if;

  loop
    attempt_count := attempt_count + 1;

    select string_agg(substr(alphabet, floor(random() * length(alphabet) + 1)::integer, 1), '')
    into new_invite_code
    from generate_series(1, 6);

    begin
      insert into public.groups (name, invite_code, created_by)
      values (cleaned_name, new_invite_code, auth.uid())
      returning id into new_group_id;

      exit;
    exception
      when unique_violation then
        if attempt_count >= 5 then
          raise;
        end if;
    end;
  end loop;

  insert into public.group_members (group_id, user_id, role)
  values (new_group_id, auth.uid(), 'leader');

  return query
  select g.id, g.name, g.invite_code
  from public.groups g
  where g.id = new_group_id;
end;
$$;

revoke all on function public.create_group_with_leader(text) from public;
grant execute on function public.create_group_with_leader(text) to authenticated;
