-- allow any signed-in user to create (insert) an organization
create policy "authenticated users can create orgs"
  on organizations for insert to authenticated with check (true);
