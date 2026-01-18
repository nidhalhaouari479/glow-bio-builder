-- Create a table for analytics events
create table analytics_events (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references profiles(id) not null,
  event_type text not null check (event_type in ('view', 'click')),
  target_type text check (target_type in ('social_link', 'contact_button', 'profile')),
  target_id text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table analytics_events enable row level security;

-- Indexing for performance
create index idx_analytics_events_profile_id on analytics_events(profile_id);
create index idx_analytics_events_created_at on analytics_events(created_at);

-- Policies
create policy "Analytics are viewable by profile owners." on analytics_events
  for select using (auth.uid() = profile_id);

create policy "Anyone can insert analytics events." on analytics_events
  for insert with check (true);

-- Functions for aggregation (optional but helpful for dashboard)
create or replace function get_profile_stats(p_id uuid, days_back int default 7)
returns json as $$
declare
  result json;
begin
  select json_build_object(
    'total_views', (select count(*) from analytics_events where profile_id = p_id and event_type = 'view'),
    'total_clicks', (select count(*) from analytics_events where profile_id = p_id and event_type = 'click'),
    'daily_views', (
      select json_agg(row_to_json(t))
      from (
        select 
          date_trunc('day', created_at)::date as date,
          count(*) as count
        from analytics_events
        where profile_id = p_id and event_type = 'view' and created_at > now() - (days_back || ' days')::interval
        group by 1
        order by 1
      ) t
    ),
    'top_links', (
      select json_agg(row_to_json(t))
      from (
        select 
          target_id,
          target_type,
          count(*) as clicks
        from analytics_events
        where profile_id = p_id and event_type = 'click'
        group by 1, 2
        order by 3 desc
        limit 5
      ) t
    )
  ) into result;
  
  return result;
end;
$$ language plpgsql security definer;
