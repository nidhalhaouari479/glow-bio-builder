-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  username text unique,
  full_name text,
  avatar_url text,
  bio text,
  theme_config jsonb,
  custom_domain text unique,
  updated_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create a table for social links
create table social_links (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) not null,
  platform text not null,
  url text not null,
  "order" integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table social_links enable row level security;

create policy "Social links are viewable by everyone." on social_links
  for select using (true);

create policy "Users can insert their own social links." on social_links
  for insert with check (auth.uid() = user_id);

create policy "Users can update own social links." on social_links
  for update using (auth.uid() = user_id);

create policy "Users can delete own social links." on social_links
  for delete using (auth.uid() = user_id);

-- Create a secure bucket for avatar images
insert into storage.buckets (id, name, public) 
values ('avatars', 'avatars', true);

create policy "Avatar images are publicly accessible." on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Anyone can upload an avatar." on storage.objects
  for insert with check (bucket_id = 'avatars');

create policy "Anyone can update an avatar." on storage.objects
  for update using (bucket_id = 'avatars');
