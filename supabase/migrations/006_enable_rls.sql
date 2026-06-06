-- [GenAI Use] Prompt: "Role: Supabase expert. Re-enable RLS on all tables with simplified policies. I defined the rules: users see/manage only their own memberships/rsvps, public events visible to all authenticated users, follower-only events visible to org members, admins can insert/update events."
-- [GenAI Use] LLM Response Start
-- enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- organizations: anyone can read, authenticated users can create, admins can update
CREATE POLICY "orgs_select" ON organizations FOR SELECT USING (true);
CREATE POLICY "orgs_insert" ON organizations FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "orgs_update" ON organizations FOR UPDATE USING (
  auth.uid() IN (SELECT user_id FROM memberships WHERE org_id = id AND role = 'admin')
);

-- memberships: users can only see/insert/delete their own
CREATE POLICY "memberships_select" ON memberships FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "memberships_insert" ON memberships FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "memberships_delete" ON memberships FOR DELETE USING (auth.uid() = user_id);

-- events: public events visible to all authenticated users, follower events only to members
CREATE POLICY "events_select" ON events FOR SELECT USING (
  visibility = 'public' OR
  auth.uid() IN (SELECT user_id FROM memberships WHERE org_id = events.org_id)
);
CREATE POLICY "events_insert" ON events FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT user_id FROM memberships WHERE org_id = events.org_id AND role = 'admin')
);

-- rsvps: users can only see/insert/delete their own
CREATE POLICY "rsvps_select" ON rsvps FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "rsvps_insert" ON rsvps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "rsvps_delete" ON rsvps FOR DELETE USING (auth.uid() = user_id);

-- profiles: anyone can read, users manage their own
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);
-- [GenAI Use] LLM Response End
-- [GenAI Use] Reflection: Same as 002_rls in the sense that I wrote the rules and constraints, Claude handled the PostgreSQL syntax that we didn't learn directly in class.
