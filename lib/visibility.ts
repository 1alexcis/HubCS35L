import type { Role, Visibility } from '@/lib/types'

export type ViewerRole = Role | undefined

export function roleForOrg(
  roles: Partial<Record<string, Role>>,
  orgId: string,
  adminOf?: string,
): ViewerRole {
  let result: ViewerRole = undefined

  if (adminOf !== undefined && orgId === adminOf) {
    result = 'admin'
  } else {
    const found = roles[orgId]
    if (found === 'admin') {
      result = 'admin'
    } else if (found === 'follower') {
      result = 'follower'
    } else {
      result = undefined
    }
  }

  return result
}

export function canViewEvent(visibility: Visibility, viewerRole: ViewerRole): boolean {
  if (visibility === 'public') {
    return true
  }

  if (visibility === 'followers') {
    if (viewerRole !== undefined && viewerRole !== null) {
      return true
    } else {
      return false
    }
  }

  return false
}
