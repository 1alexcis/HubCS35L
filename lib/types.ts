export type Role = 'admin' | 'member' | 'follower' | 'applicant' | 'visitor'
export type Visibility = 'public' | 'followers' | 'members'
export type AppStatus = 'open' | 'closed'
export type ApplicantStatus = 'pending' | 'accepted' | 'rejected'

export interface Org {
  id: string
  name: string
  short: string
  tagline: string
  color: string
  logo: string
  category: string
  about: string
  members: number
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

export interface Announcement {
  id: string
  orgId: string
  title: string
  body: string
  posted: Date
  visibility: Visibility
  urgent?: boolean
  reactions?: Record<string, number>
}

export interface Application {
  id: string
  orgId: string
  name: string
  questions: string[]
  deadline: Date
  status: AppStatus
  submissions: number
  capacity: number
}

export interface Applicant {
  id: string
  name: string
  initials: string
  major: string
  applicationId: string
  orgId: string
  submitted: Date
  status: ApplicantStatus
  answers: string[]
}

export interface CurrentUser {
  name: string
  email: string
  initials: string
  major: string
  roles: Record<string, Role>
  adminOf: string
  rsvped: Set<string>
}
