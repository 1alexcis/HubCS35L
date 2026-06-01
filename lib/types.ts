export type Role = 'admin' | 'follower'
export type Visibility = 'public' | 'followers'

export interface Org {
  id: string
  name: string
  short: string
  tagline: string
  color: string
  logo: string
  category: string
  about: string
  followers: number
  founded: number
}

export interface Event {
  id: string
  orgId: string
  title: string
  date: Date
  location: string
  description: string
  visibility: Visibility
  rsvps: number
}

export interface CurrentUser {
  name: string
  email: string
  initials: string
  major: string
  roles: Partial<Record<string, Role>>
  adminOf: string
  rsvped: Set<string>
}
