import type { Org, Event, CurrentUser } from './types'

export const TODAY = new Date(2026, 4, 6)

export function day(offset: number, hour = 18, min = 0): Date {
  const d = new Date(TODAY)
  d.setDate(d.getDate() + offset)
  d.setHours(hour, min, 0, 0)
  return d
}

export const ORGS: Org[] = [
  { id: 'o1', name: 'ACM at UCLA', short: 'ACM', tagline: 'The largest CS org on campus.', color: '#3b3a8a', logo: 'AC', category: 'Technology', followers: 1840, about: 'ACM runs hack nights, an interview prep track, and an industry speaker series.', founded: 2003 },
  { id: 'o2', name: 'Bruin Entrepreneurs', short: 'BE', tagline: 'Connect founders and builders.', color: '#a04a1f', logo: 'BE', category: 'Business', followers: 351, about: 'BE supports UCLA students starting companies through workshops and mentorship.', founded: 2014 },
  { id: 'o3', name: 'UCLA Film Society', short: 'FS', tagline: 'Weekly screenings and industry talks.', color: '#7a4ad6', logo: 'FS', category: 'Arts', followers: 412, about: 'Film Society hosts weekly screenings, director Q&As, and a student-run film festival each spring.', founded: 2009 },
  { id: 'o4', name: 'Bruin Consulting', short: 'BC', tagline: 'Pro bono consulting for LA non-profits.', color: '#1f4ea8', logo: 'BC', category: 'Business', followers: 612, about: 'BC pairs undergraduate teams with mission-driven non-profits in LA.', founded: 2011 },
  { id: 'o5', name: 'Pre-Med Society', short: 'PMS', tagline: 'MCAT, mentorship, and clinical exposure.', color: '#a83a3a', logo: 'PM', category: 'Pre-Professional', followers: 1102, about: 'PMS runs MCAT cohorts, physician panels, and connects pre-meds with clinical opportunities.', founded: 2001 },
  { id: 'o6', name: 'Kerckhoff Coffee House', short: 'KCH', tagline: 'Campus coffeehouse and open mic venue.', color: '#6b5a2c', logo: 'KC', category: 'Arts', followers: 274, about: 'KCH is a student-run coffeehouse hosting weekly open mics and acoustic shows.', founded: 1993 },
  { id: 'o7', name: 'Ballroom Dance at UCLA', short: 'BDC', tagline: 'Competitive and social ballroom dancing.', color: '#8a3a6f', logo: 'BD', category: 'Sports', followers: 540, about: 'Open to all skill levels. We compete intercollegiately and host two socials a quarter.', founded: 2007 },
  { id: 'o8', name: 'Asian Pacific Coalition', short: 'APC', tagline: 'Advocacy and community for APA students.', color: '#0e7d8a', logo: 'AP', category: 'Cultural', followers: 902, about: 'APC is a coalition of Asian Pacific student organizations focused on advocacy and community.', founded: 1991 },
  { id: 'o9', name: 'Bruin Democrats', short: 'BD', tagline: 'Political organizing and civic engagement.', color: '#2c5d8a', logo: 'DM', category: 'Political', followers: 488, about: 'Bruin Dems organizes for local and national candidates and runs voter registration drives.', founded: 2008 },
  { id: 'o10', name: 'Sunset Hiking Club', short: 'SHC', tagline: 'Weekend hikes around LA.', color: '#0f6f5c', logo: 'SH', category: 'Recreation', followers: 1004, about: 'Weekend hikes around LA. All levels welcome — we always have a beginner-friendly group.', founded: 2019 },
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
