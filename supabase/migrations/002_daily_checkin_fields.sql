create type public.checkin_mood_new as enum ('good', 'normal', 'hard', 'need_prayer');

alter table public.checkins
  add column woke_up boolean not null default false,
  add column bible_read boolean not null default false,
  add column prayed boolean not null default false,
  add column meditated boolean not null default false,
  add column attended boolean not null default false;

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
