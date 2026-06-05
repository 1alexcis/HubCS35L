/* Visibility checks for events, separate file for clarity & informationhiding principle (this stuff is likely to change)*/
import type { Role, Visibility } from '@/lib/types'

export type ViewerRole = Role | undefined

/**
 * Returns the viewer's role for a given club
 * @param roles -> map of orgId to role from the user's memberships
 * @param orgId -> the org being viewed
 * @param adminOf -> optional orgId the user admins
 * @returns 'admin' | 'follower' | undefined
 */
export function roleForOrg(
  roles: Partial<Record<string, Role>>,
  orgId: string,
  adminOf?: string,
): ViewerRole {
  if (orgId === adminOf) return 'admin'
  return roles[orgId] ?? undefined
}

/**
 * Returns whether a viewer is allowed to see an event based on its visibility and viewer role
 * @param visibility -> the event's visibility setting ('public' | 'followers')
 * @param viewerRole -> the viewer's role for the org, or undefined if guest
 * @returns true if the viewer can see the event, false otherwise
 */
export function canViewEvent(visibility: Visibility, viewerRole: ViewerRole): boolean {
  if (visibility !== 'public' && visibility !== 'followers') {
    throw new Error(`Unexpected visibility value: ${visibility}`)
  }
  return visibility === 'public' || viewerRole != null
}