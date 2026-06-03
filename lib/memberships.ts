import type { Role } from './types'
import { ME } from './data'

export type RoleMap = Partial<Record<string, Role>>

// Mock fallback — used by client components not yet migrated to the DB seam.
export function getMyRolesMock(): RoleMap {
  return { ...ME.roles, [ME.adminOf]: 'admin' }
}

/**
 * Returns the signed-in user's org roles from the real memberships table.
 * Server-only: call from Server Components or Route Handlers only.
 *
 * Note: event visibility is ALSO enforced server-side by RLS in
 * supabase/migrations/002_rls.sql — this client map is for UI convenience only.
 */
export async function getMyRolesFromDb(): Promise<RoleMap> {
  // Dynamic import keeps next/headers out of the client bundle.
  const { createClient } = await import('./supabase/server')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return {}
  const { data } = await supabase
    .from('memberships')
    .select('org_id, role')
    .eq('user_id', user.id)
  if (!data) return {}
  return Object.fromEntries(
    (data as { org_id: string; role: string }[]).map(m => [m.org_id, m.role as Role])
  )
}
