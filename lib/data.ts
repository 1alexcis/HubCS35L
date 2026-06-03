import type { Org, Event, CurrentUser } from './types'

export const TODAY = new Date()

export function day(offset: number, hour = 18, min = 0): Date {
  const d = new Date(TODAY)
  d.setDate(d.getDate() + offset)
  d.setHours(hour, min, 0, 0)
  return d
}

export const ORGS: Org[] = [
  { id: 'o1', name: 'ACM at UCLA', short: 'ACM', tagline: 'The largest CS org on campus', color: '#3b3a8a', logo: 'AC', category: 'Technology', followers: 1840, about: 'ACM runs hack nights, an interview prep track, and an industry speaker series.', founded: 2003 },
  { id: 'o2', name: 'Bruin Entrepreneurs', short: 'BE', tagline: 'Connect founders and builders', color: '#a04a1f', logo: 'BE', category: 'Business', followers: 351, about: 'BE supports UCLA students starting companies through workshops and mentorship.', founded: 2014 },
  { id: 'o3', name: 'UConsulting', short: 'UC', tagline: 'Future consultants, entrepreneurs, and business leaders', color: '#7a4ad6', logo: 'UC', category: 'Business', followers: 412, about: 'UC ', founded: 2009 },
  { id: 'o4', name: 'Bruin Consulting', short: 'BC', tagline: 'Management consulting at Fortune 500 companies', color: '#1f4ea8', logo: 'BC', category: 'Business', followers: 612, about: 'BC pairs undergraduate teams with mission-driven non-profits in LA.', founded: 2011 },
  { id: 'o5', name: 'Bruin Strategy Network', short: 'BSN', tagline: 'Management and Healthcare Consulting', color: '#a83a3a', logo: 'BS', category: 'Business', followers: 1102, about: 'BSN', founded: 2001 },
  { id: 'o6', name: 'Bruin AI', short: 'BA', tagline: 'Building AI solutions for startups and Fortune-500 companies', color: '#6b5a2c', logo: 'BA', category: 'Technology', followers: 274, about: 'Bruin AI', founded: 1993 },
  { id: 'o7', name: 'Bruin Beans', short: 'BB', tagline: 'Working in nephrology towards kidney disease', color: '#8a3a6f', logo: 'BB', category: 'Medical', followers: 540, about: 'Bruin AI', founded: 2007 },
  { id: 'o8', name: 'Bruin Stroke Force', short: 'BSF', tagline: 'Spread awareness of stroke in neurology', color: '#0e7d8a', logo: 'BS', category: 'Medical', followers: 902, about: 'Bruin Stroke Force', founded: 1991 },
  { id: 'o9', name: 'VEST', short: 'V', tagline: 'Cultivating a startup ecosystem at UCLA', color: '#2c5d8a', logo: 'V', category: 'Technology', followers: 488, about: 'VEST', founded: 2008 },
  { id: 'o10', name: 'Product Space', short: 'PS', tagline: 'UCLA\'s premier product organization', color: '#0f6f5c', logo: 'PS', category: 'Technology', followers: 1004, about: 'Product Space', founded: 2019 },
]

export const EVENTS: Event[] = [
  { id: 'e1', orgId: 'o1', title: 'Spring GBM', date: day(2), location: 'Boelter 3400', description: 'General body meeting.', visibility: 'public', rsvps: 112 },
  { id: 'e2', orgId: 'o1', title: 'Hackathon Kickoff', date: day(5, 10), location: 'Pauley Pavilion', description: 'Opening ceremony for spring hackathon.', visibility: 'followers', rsvps: 168 },
  { id: 'e3', orgId: 'o2', title: 'Startup Pitch Night', date: day(3, 19), location: 'Anderson 2317', description: 'Students pitch to alumni founders.', visibility: 'public', rsvps: 47 },
  { id: 'e4', orgId: 'o3', title: 'Screening: Mulholland Drive', date: day(1, 20), location: 'James Bridges Theater', description: 'Monthly film screening.', visibility: 'public', rsvps: 64 },
  { id: 'e6', orgId: 'o5', title: 'MCAT Study Session', date: day(2, 14), location: 'Powell Library', description: 'Group study session.', visibility: 'followers', rsvps: 41 },
  { id: 'e7', orgId: 'o7', title: 'Beginner Waltz Workshop', date: day(6, 18), location: 'Ackerman Grand Ballroom', description: 'No experience needed.', visibility: 'public', rsvps: 89 },
  { id: 'e9', orgId: 'o9', title: 'Voter Registration Drive', date: day(0, 11), location: 'Bruin Plaza', description: 'Help register voters on campus.', visibility: 'public', rsvps: 24 },
  { id: 'e10', orgId: 'o10', title: 'Griffith Park Hike', date: day(9, 8), location: 'Griffith Observatory', description: 'Easy 5-mile loop.', visibility: 'public', rsvps: 18 },
]

export const ME: CurrentUser = {
  name: 'Alex Chen',
  email: 'alex@g.ucla.edu',
  initials: 'AC',
  major: 'Computer Science · 2nd year',
  adminOf: 'o1',
  rsvped: new Set(['e1', 'e3', 'e7']),
  roles: {
    o1: 'admin',
    o2: 'follower',
    o3: 'follower',
    o4: 'follower',
    o7: 'follower',
  },
}
