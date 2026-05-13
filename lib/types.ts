export type Role = 'admin' | 'member' | 'follower' | 'applicant' | 'none'
export type Visibility = 'public' | 'followers' | 'members'
export type AppStatus = 'pending' | 'accepted' | 'rejected'

export interface User {
  id: string
  name: string
  email: string
}

export interface Org {
  id: string
  name: string
  description: string
  logoUrl: string
  visibility: 'public' | 'private'
  category: string
}

export interface Event {
  id: string
  orgId: string
  title: string
  date: Date
  location: string
  description: string
  visibility: Visibility
}

export interface Announcement {
  id: string
  orgId: string
  title: string
  body: string
  visibility: Visibility
  createdAt: Date
  urgent?: boolean
}

export interface Question {
  id: string
  prompt: string
}

export interface Application {
  id: string
  orgId: string
  questions: Question[]
  deadline: Date
  open: boolean
}

export interface Applicant {
  id: string
  userId: string
  name: string
  applicationId: string
  orgId: string
  answers: Record<string, string>
  status: AppStatus
}
