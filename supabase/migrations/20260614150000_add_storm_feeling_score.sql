alter table public.daily_storm_feelings
add column if not exists feeling_score smallint;

update public.daily_storm_feelings
set feeling_score = case when feels_storm then 2 else 0 end
where feeling_score is null;

alter table public.daily_storm_feelings
drop constraint if exists daily_storm_feelings_feeling_score_range;

alter table public.daily_storm_feelings
add constraint daily_storm_feelings_feeling_score_range
check (feeling_score is null or feeling_score between -3 and 3);

drop view if exists public.daily_storm_feeling_stats;

create or replace view public.daily_storm_feeling_stats as
select
  response_date,
  count(*)::integer as total,
  count(*) filter (where coalesce(feeling_score, case when feels_storm then 2 else 0 end) > 0)::integer as yes,
  count(*) filter (where coalesce(feeling_score, case when feels_storm then 2 else 0 end) <= 0)::integer as no,
  count(*) filter (where coalesce(feeling_score, case when feels_storm then 2 else 0 end) < 0)::integer as better,
  count(*) filter (where coalesce(feeling_score, case when feels_storm then 2 else 0 end) = 0)::integer as neutral,
  count(*) filter (where coalesce(feeling_score, case when feels_storm then 2 else 0 end) > 0)::integer as worse,
  case
    when count(*) > 0 then round((count(*) filter (where coalesce(feeling_score, case when feels_storm then 2 else 0 end) > 0))::numeric / count(*)::numeric * 100)::integer
    else 0
  end as yes_percent,
  case
    when count(*) > 0 then 100 - round((count(*) filter (where coalesce(feeling_score, case when feels_storm then 2 else 0 end) > 0))::numeric / count(*)::numeric * 100)::integer
    else 0
  end as no_percent,
  avg(coalesce(feeling_score, case when feels_storm then 2 else 0 end)) as avg_feeling_score,
  avg(kp_now) as avg_kp_now,
  max(kp_today_max) as max_kp_today
from public.daily_storm_feelings
group by response_date;
