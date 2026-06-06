-- [GenAI Use] Prompt: "Role: Supabase/PostgreSQL expert. Context: Supabase app with 5 tables: profiles, organizations, memberships, events, rsvps. Task: Write RLS policies. Rules I defined: only authenticated users can read all orgs/profiles/memberships, users manage only their own rows, org admins (role='admin' in memberships) can update/delete their org's events and org."
-- [GenAI Use] LLM Response Start
alter table profiles enable row level security;
alter table organizations enable row level security;
alter table memberships enable row level security;
alter table events enable row level security;
alter table rsvps enable row level security;

-- profiles
create policy "authenticated users can read profiles"
  on profiles for select to authenticated using (true);

create policy "users can update their own profile"
  on profiles for update to authenticated using (auth.uid() = id);

-- organizations
create policy "authenticated users can read orgs"
  on organizations for select to authenticated using (true);

create policy "org admins can update org"
  on organizations for update to authenticated using (
    exists (
      select 1 from memberships
      where user_id = auth.uid()
      and org_id = organizations.id
      and role = 'admin'
    )
  );

create policy "org admins can delete org"
  on organizations for delete to authenticated using (
    exists (
      select 1 from memberships
      where user_id = auth.uid()
      and org_id = organizations.id
      and role = 'admin'
    )
  );

-- memberships
create policy "authenticated users can read memberships"
  on memberships for select to authenticated using (true);

create policy "users can follow orgs"
  on memberships for insert to authenticated with check (
    auth.uid() = user_id and role = 'follower'
  );

create policy "users can unfollow orgs"
  on memberships for delete to authenticated using (
    auth.uid() = user_id and role = 'follower'
  );

-- events
create policy "users can read visible events"
  on events for select to authenticated using (
    visibility = 'public'
    or (
      visibility = 'followers' and exists (
        select 1 from memberships
        where user_id = auth.uid()
        and org_id = events.org_id
      )
    )
  );

create policy "org admins can insert events"
  on events for insert to authenticated with check (
    exists (
      select 1 from memberships
      where user_id = auth.uid()
      and org_id = events.org_id
      and role = 'admin'
    )
  );

create policy "org admins can update events"
  on events for update to authenticated using (
    exists (
      select 1 from memberships
      where user_id = auth.uid()
      and org_id = events.org_id
      and role = 'admin'
    )
  );

create policy "org admins can delete events"
  on events for delete to authenticated using (
    exists (
      select 1 from memberships
      where user_id = auth.uid()
      and org_id = events.org_id
      and role = 'admin'
    )
  );

-- rsvps
create policy "users can read their own rsvps"
  on rsvps for select to authenticated using (auth.uid() = user_id);

create policy "users can rsvp to events"
  on rsvps for insert to authenticated with check (auth.uid() = user_id);

create policy "users can delete their own rsvps"
  on rsvps for delete to authenticated using (auth.uid() = user_id);
-- [GenAI Use] LLM Response End
-- [GenAI Use] Reflection: I defined all the access rules myself. What Claude handled was the actual the RLS syntax (auth.uid(), exists subqueries) which isn't covered in class.
