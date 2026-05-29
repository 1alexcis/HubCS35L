-- profiles mirrors auth.users, id comes from auth so no default
create table profiles (
  id uuid primary key,
  name text,
  email text,
  avatar_color text,
  created_at timestamptz default now()
);

create table organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  category text,
  avatar_color text,
  created_at timestamptz default now()
);

create table memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  org_id uuid not null references organizations(id) on delete cascade,
  role text not null check (role in ('admin', 'follower')),
  created_at timestamptz default now(),
  unique(user_id, org_id)
);

create table events (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  title text not null,
  start_time timestamptz not null,
  end_time timestamptz,
  location text,
  description text,
  visibility text not null default 'public' check (visibility in ('public', 'followers')),
  created_at timestamptz default now()
);

create table rsvps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  event_id uuid not null references events(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, event_id)
);

create index on memberships(user_id);
create index on memberships(org_id);
create index on memberships(user_id, org_id);
create index on events(org_id);
create index on events(start_time);
