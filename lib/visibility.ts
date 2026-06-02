import type { Role, Visibility } from '@/lib/types'

export type ViewerRole = Role | undefined

export function roleForOrg(
  roles: Partial<Record<string, Role>>,
  orgId: string,
  adminOf?: string,
): ViewerRole {
  if (orgId === adminOf) return 'admin'
  return roles[orgId] ?? undefined
}

export function canViewEvent(visibility: Visibility, viewerRole: ViewerRole): boolean {
  return visibility === 'public' || viewerRole != null
}
