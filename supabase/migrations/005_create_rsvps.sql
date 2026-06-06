-- [GenAI Use] Prompt: "Write a CREATE TABLE migration for rsvps with columns: id (uuid pk), user_id (fk profiles), event_id (fk events), created_at, unique(user_id, event_id). Use IF NOT EXISTS."
-- [GenAI Use] LLM Response Start
-- the rsvps table never got created on the live db; this adds it.
-- matches the definition in 001_init.sql. RLS stays off (team decision).
create table if not exists rsvps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  event_id uuid not null references events(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, event_id)
);
-- [GenAI Use] LLM Response End
-- [GenAI Use] Reflection: I defined the schema and constraints to demonstrate I understood what needed to be made. Claude wrote the DDL syntax that we didn't learn in class.
