-- public profile, mirrors auth.users
create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  avatar_url text,
  created_at timestamptz default now()
);

create table orgs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  tagline text,
  about text,
  category text,
  color text,
  logo_url text,
  created_at timestamptz default now()
);

create table memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  org_id uuid not null references orgs(id) on delete cascade,
  role text not null check (role in ('admin', 'member', 'follower', 'applicant')),
  created_at timestamptz default now(),
  unique(user_id, org_id)
);

create table events (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  title text not null,
  description text,
  location text,
  start_time timestamptz not null,
  end_time timestamptz,
  visibility text not null default 'public' check (visibility in ('public', 'followers', 'members')),
  created_at timestamptz default now()
);

create table announcements (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  title text not null,
  body text,
  visibility text not null default 'public' check (visibility in ('public', 'followers', 'members')),
  created_at timestamptz default now()
);

create table applications (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  title text not null,
  description text,
  deadline timestamptz,
  visibility text not null default 'public' check (visibility in ('public', 'followers', 'members')),
  created_at timestamptz default now()
);

create index on memberships(user_id);
create index on memberships(org_id);
create index on memberships(user_id, org_id);
create index on events(org_id);
create index on announcements(org_id);
create index on applications(org_id);
