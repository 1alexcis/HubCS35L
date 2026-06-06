-- [GenAI Use] Prompt: "Add a Supabase RLS insert policy on organizations allowing any authenticated user to create an org."
-- [GenAI Use] LLM Response Start
-- allow any signed-in user to create (insert) an organization
create policy "authenticated users can create orgs"
  on organizations for insert to authenticated with check (true);
-- [GenAI Use] LLM Response End
-- [GenAI Use] Reflection: Although policy was just one-liners, needed the correct Supabase RLS syntax that we didn't directly learn in class.
