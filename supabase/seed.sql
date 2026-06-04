/* seed script for initial data */
-- organizations
INSERT INTO organizations (id, name, description, created_at)
VALUES
  ('10000000-0000-0000-0000-000000000001', 'ACM at UCLA',            'ACM runs hack nights, an interview prep track, and an industry speaker series.',    now()),
  ('10000000-0000-0000-0000-000000000002', 'Bruin Entrepreneurs',    'BE supports UCLA students starting companies through workshops and mentorship.',     now()),
  ('10000000-0000-0000-0000-000000000003', 'UConsulting',            'Future consultants, entrepreneurs, and business leaders.',                           now()),
  ('10000000-0000-0000-0000-000000000004', 'Bruin Consulting',       'BC pairs undergraduate teams with mission-driven non-profits in LA.',                 now()),
  ('10000000-0000-0000-0000-000000000005', 'Bruin Strategy Network', 'Management and healthcare consulting for students who want real-world experience.',   now()),
  ('10000000-0000-0000-0000-000000000006', 'Bruin AI',               'Building AI solutions for startups and Fortune 500 companies.',                      now()),
  ('10000000-0000-0000-0000-000000000007', 'Bruin Beans',            'Working in nephrology towards kidney disease awareness and research.',                now()),
  ('10000000-0000-0000-0000-000000000008', 'Bruin Stroke Force',     'Spreading awareness of stroke and supporting neurology outreach on campus.',         now()),
  ('10000000-0000-0000-0000-000000000009', 'VEST',                   'Cultivating a startup ecosystem at UCLA through community and resources.',           now()),
  ('10000000-0000-0000-0000-000000000010', 'Product Space',          'UCLA''s premier product organization for aspiring PMs and designers.',               now())
ON CONFLICT (id) DO UPDATE SET
  name        = EXCLUDED.name,
  description = EXCLUDED.description;

-- profiles
INSERT INTO profiles (id, name, email)
VALUES
  ('b2164f2a-89f5-42a4-8e23-5c004a5fce08', 'Alex Chen', 'alexchen@ucla.edu')
ON CONFLICT (id) DO NOTHING;

-- memberships
INSERT INTO memberships (id, user_id, org_id, role)
VALUES
  (gen_random_uuid(), 'b2164f2a-89f5-42a4-8e23-5c004a5fce08', '10000000-0000-0000-0000-000000000001', 'admin'),
  (gen_random_uuid(), 'b2164f2a-89f5-42a4-8e23-5c004a5fce08', '10000000-0000-0000-0000-000000000002', 'follower'),
  (gen_random_uuid(), 'b2164f2a-89f5-42a4-8e23-5c004a5fce08', '10000000-0000-0000-0000-000000000003', 'follower'),
  (gen_random_uuid(), 'b2164f2a-89f5-42a4-8e23-5c004a5fce08', '10000000-0000-0000-0000-000000000004', 'follower'),
  (gen_random_uuid(), 'b2164f2a-89f5-42a4-8e23-5c004a5fce08', '10000000-0000-0000-0000-000000000007', 'follower')
ON CONFLICT (user_id, org_id) DO NOTHING;

-- events
INSERT INTO events (id, org_id, title, start_time, end_time, location, description)
VALUES
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Spring GBM',           '2026-05-08T18:00:00', NULL, 'Boelter 3400',    'General body meeting.'),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Hackathon Kickoff',    '2026-05-11T10:00:00', NULL, 'Pauley Pavilion', 'Opening ceremony for spring hackathon.'),
  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', 'Startup Pitch Night',  '2026-05-09T19:00:00', NULL, 'Anderson 2317',   'Students pitch to alumni founders.')
ON CONFLICT (id) DO NOTHING;
