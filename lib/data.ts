import type { User, Org, Event, Announcement, Application, Applicant, Role } from './types'

export const TODAY = new Date(2026, 4, 6)

export function day(offset: number, hour = 18, min = 0): Date {
  const d = new Date(TODAY)
  d.setDate(d.getDate() + offset)
  d.setHours(hour, min, 0, 0)
  return d
}

export const ME: User = { id: 'u0', name: 'Alex Chen', email: 'alex@g.ucla.edu' }

export const ORGS: Org[] = [
  { id: 'o1', name: 'ACM at UCLA', description: 'Largest CS org on campus.', logoUrl: '/logos/acm.png', visibility: 'public', category: 'Technology' },
  { id: 'o2', name: 'Bruin Entrepreneurs', description: 'Connect founders and builders.', logoUrl: '/logos/be.png', visibility: 'public', category: 'Business' },
  { id: 'o3', name: 'UCLA Film Society', description: 'Weekly screenings and industry talks.', logoUrl: '/logos/film.png', visibility: 'public', category: 'Arts' },
  { id: 'o4', name: 'Bruin Consulting Group', description: 'Case competitions and pro bono consulting.', logoUrl: '/logos/bcg.png', visibility: 'public', category: 'Business' },
  { id: 'o5', name: 'Pre-Med Society', description: 'Resources and community for pre-med students.', logoUrl: '/logos/premed.png', visibility: 'public', category: 'Pre-Professional' },
  { id: 'o6', name: 'Kerckhoff Coffee House', description: 'Campus coffeehouse and open mic venue.', logoUrl: '/logos/kch.png', visibility: 'public', category: 'Arts' },
  { id: 'o7', name: 'Ballroom Dance at UCLA', description: 'Competitive and social ballroom dancing.', logoUrl: '/logos/dance.png', visibility: 'public', category: 'Sports' },
  { id: 'o8', name: 'Asian Pacific Coalition', description: 'Advocacy and community for APA students.', logoUrl: '/logos/apc.png', visibility: 'public', category: 'Cultural' },
  { id: 'o9', name: 'Bruin Democrats', description: 'Political organizing and civic engagement.', logoUrl: '/logos/dem.png', visibility: 'public', category: 'Political' },
  { id: 'o10', name: 'Sunset Hiking Club', description: 'Weekend hikes around LA.', logoUrl: '/logos/hike.png', visibility: 'public', category: 'Recreation' },
]

export const EVENTS: Event[] = [
  { id: 'e1', orgId: 'o1', title: 'Spring GBM', date: day(2), location: 'Boelter 3400', description: 'General body meeting.', visibility: 'public' },
  { id: 'e2', orgId: 'o1', title: 'Hackathon Kickoff', date: day(5, 10), location: 'Pauley Pavilion', description: 'Opening ceremony for spring hackathon.', visibility: 'followers' },
  { id: 'e3', orgId: 'o2', title: 'Startup Pitch Night', date: day(3, 19), location: 'Anderson 2317', description: 'Students pitch to alumni founders.', visibility: 'public' },
  { id: 'e4', orgId: 'o3', title: 'Screening: Mulholland Drive', date: day(1, 20), location: 'James Bridges Theater', description: 'Monthly film screening.', visibility: 'public' },
  { id: 'e5', orgId: 'o4', title: 'Case Workshop', date: day(4, 17), location: 'Gold 1330', description: 'Members-only case prep session.', visibility: 'members' },
  { id: 'e6', orgId: 'o5', title: 'MCAT Study Session', date: day(2, 14), location: 'Powell Library', description: 'Group study session.', visibility: 'followers' },
  { id: 'e7', orgId: 'o7', title: 'Beginner Waltz Workshop', date: day(6, 18), location: 'Ackerman Grand Ballroom', description: 'No experience needed.', visibility: 'public' },
  { id: 'e8', orgId: 'o8', title: 'Culture Night Planning', date: day(7, 19), location: 'Kerckhoff 131', description: 'Planning meeting for Culture Night.', visibility: 'members' },
  { id: 'e9', orgId: 'o9', title: 'Voter Registration Drive', date: day(0, 11), location: 'Bruin Plaza', description: 'Help register voters on campus.', visibility: 'public' },
  { id: 'e10', orgId: 'o10', title: 'Griffith Park Hike', date: day(9, 8), location: 'Griffith Observatory', description: 'Easy 5-mile loop.', visibility: 'public' },
]

export const ANNOUNCEMENTS: Announcement[] = [
  { id: 'an1', orgId: 'o1', title: 'Applications open', body: 'Apply to join ACM by May 15.', visibility: 'public', createdAt: day(-3) },
  { id: 'an2', orgId: 'o2', title: 'Spring cohort accepted', body: 'Congrats to everyone accepted. Check your email.', visibility: 'followers', createdAt: day(-1) },
  { id: 'an3', orgId: 'o4', title: 'Case comp results', body: 'Congrats to our winning team from last weekend.', visibility: 'members', createdAt: day(-2) },
  { id: 'an4', orgId: 'o9', title: 'Rally this Saturday', body: 'Meet at Janss Steps at noon.', visibility: 'public', createdAt: day(0), urgent: true },
  { id: 'an5', orgId: 'o7', title: 'Competition schedule posted', body: 'Check the schedule pinned in the members tab.', visibility: 'followers', createdAt: day(-4) },
]

export const APPLICATIONS: Application[] = [
  {
    id: 'app1',
    orgId: 'o4',
    deadline: day(14),
    open: true,
    questions: [
      { id: 'q1', prompt: 'Why do you want to join Bruin Consulting?' },
      { id: 'q2', prompt: 'Describe a time you solved a complex problem.' },
    ],
  },
  {
    id: 'app2',
    orgId: 'o2',
    deadline: day(7),
    open: true,
    questions: [
      { id: 'q3', prompt: 'What startup idea are you working on?' },
      { id: 'q4', prompt: 'What skills do you bring to the community?' },
    ],
  },
  {
    id: 'app3',
    orgId: 'o8',
    deadline: day(-2),
    open: false,
    questions: [
      { id: 'q5', prompt: 'How have you engaged with the APA community at UCLA?' },
    ],
  },
]

export const APPLICANTS: Applicant[] = [
  { id: 'apl1', userId: 'u1', name: 'Jordan Lee', applicationId: 'app1', orgId: 'o4', answers: { q1: 'Strategy fascinates me.', q2: 'Fixed a broken deployment pipeline under deadline.' }, status: 'pending' },
  { id: 'apl2', userId: 'u2', name: 'Maya Patel', applicationId: 'app1', orgId: 'o4', answers: { q1: 'I want to break into consulting.', q2: 'Led a team redesign of a legacy codebase.' }, status: 'pending' },
  { id: 'apl3', userId: 'u3', name: 'Chris Wu', applicationId: 'app1', orgId: 'o4', answers: { q1: 'To sharpen my business thinking.', q2: 'Optimized a slow database query.' }, status: 'accepted' },
  { id: 'apl4', userId: 'u4', name: 'Sofia Torres', applicationId: 'app2', orgId: 'o2', answers: { q3: 'EdTech platform for first-gen students.', q4: 'Product design and user research.' }, status: 'pending' },
  { id: 'apl5', userId: 'u5', name: 'Daniel Kim', applicationId: 'app2', orgId: 'o2', answers: { q3: 'A carbon offset marketplace.', q4: 'Full-stack dev, some ML.' }, status: 'rejected' },
]

// ME's role in each org
export const MEMBERSHIPS: Record<string, Role> = {
  o1: 'admin',
  o2: 'follower',
  o3: 'follower',
  o4: 'member',
  o7: 'follower',
}
