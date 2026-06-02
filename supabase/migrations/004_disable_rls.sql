-- team decision: keep RLS off for now.
-- 002_rls.sql turned RLS on; this turns it back off on every table so the
-- migration history ends with RLS disabled, matching the live database.
alter table profiles disable row level security;
alter table organizations disable row level security;
alter table memberships disable row level security;
alter table events disable row level security;
alter table rsvps disable row level security;
