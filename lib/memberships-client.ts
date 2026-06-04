/* Client side helpers for reading and updating org memberships */
import type { Role } from './types'
import { ME } from './data'

export type RoleMap = Partial<Record<string, Role>>

export function getMyRolesMock(): RoleMap {
  return { ...ME.roles, [ME.adminOf]: 'admin' }
}
