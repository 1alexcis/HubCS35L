-- the rsvps table never got created on the live db; this adds it.
-- matches the definition in 001_init.sql. RLS stays off (team decision).
create table if not exists rsvps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  event_id uuid not null references events(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, event_id)
);
