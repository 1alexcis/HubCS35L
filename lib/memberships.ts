import type { Role } from './types'
import { ME } from './data'

export type RoleMap = Partial<Record<string, Role>>

export function getMyRoles(): RoleMap {
  return { ...ME.roles, [ME.adminOf]: 'admin' }
}
