/* Visibility checks for events, separate file for clarity & informationhiding principle (this stuff is likely to change)*/
// [GenAI Use] Prompt:
// I need the role logic for the org pages. Write a roleForOrg helper that takes
// the user's memberships (a map of org id to role), the org id being viewed, and
// an optional org id they admin, and returns 'admin', 'follower', or undefined so
// the page knows which controls to show. Also a canViewEvent helper that decides
// if someone can see an event from its visibility ('public' or 'followers') and
// their role. Keep them pure functions and keep it simple.
// [GenAI Use] LLM Response Start
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
// [GenAI Use] LLM Response End
// [GenAI Use] Reflection: I defined the access rules myself (admin overrides any membership, followers and admins can see follower-only events, and guests only see public ones). Claude wrote the helper structure, and I added the guard that throws on an unexpected visibility value so a bad value fails loudly instead of silently hiding events.