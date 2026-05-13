import type { Org, Event, Announcement, Application, Applicant, CurrentUser } from './types'

export const TODAY = new Date(2026, 4, 6)

export function day(offset: number, hour = 18, min = 0): Date {
  const d = new Date(TODAY)
  d.setDate(d.getDate() + offset)
  d.setHours(hour, min, 0, 0)
  return d
}

export const ORGS: Org[] = [
  { id: 'o1', name: 'ACM at UCLA', short: 'ACM', tagline: 'The largest CS org on campus.', color: '#3b3a8a', logo: 'AC', category: 'Technology', members: 210, followers: 1840, about: 'ACM runs hack nights, an interview prep track, and an industry speaker series.', founded: 2003 },
  { id: 'o2', name: 'Bruin Entrepreneurs', short: 'BE', tagline: 'Connect founders and builders.', color: '#a04a1f', logo: 'BE', category: 'Business', members: 47, followers: 351, about: 'BE supports UCLA students starting companies through workshops and mentorship.', founded: 2014 },
  { id: 'o3', name: 'UCLA Film Society', short: 'FS', tagline: 'Weekly screenings and industry talks.', color: '#7a4ad6', logo: 'FS', category: 'Arts', members: 54, followers: 412, about: 'Film Society hosts weekly screenings, director Q&As, and a student-run film festival each spring.', founded: 2009 },
  { id: 'o4', name: 'Bruin Consulting', short: 'BC', tagline: 'Pro bono consulting for LA non-profits.', color: '#1f4ea8', logo: 'BC', category: 'Business', members: 84, followers: 612, about: 'BC pairs undergraduate teams with mission-driven non-profits in LA.', founded: 2011 },
  { id: 'o5', name: 'Pre-Med Society', short: 'PMS', tagline: 'MCAT, mentorship, and clinical exposure.', color: '#a83a3a', logo: 'PM', category: 'Pre-Professional', members: 154, followers: 1102, about: 'PMS runs MCAT cohorts, physician panels, and connects pre-meds with clinical opportunities.', founded: 2001 },
  { id: 'o6', name: 'Kerckhoff Coffee House', short: 'KCH', tagline: 'Campus coffeehouse and open mic venue.', color: '#6b5a2c', logo: 'KC', category: 'Arts', members: 28, followers: 274, about: 'KCH is a student-run coffeehouse hosting weekly open mics and acoustic shows.', founded: 1993 },
  { id: 'o7', name: 'Ballroom Dance at UCLA', short: 'BDC', tagline: 'Competitive and social ballroom dancing.', color: '#8a3a6f', logo: 'BD', category: 'Sports', members: 96, followers: 540, about: 'Open to all skill levels. We compete intercollegiately and host two socials a quarter.', founded: 2007 },
  { id: 'o8', name: 'Asian Pacific Coalition', short: 'APC', tagline: 'Advocacy and community for APA students.', color: '#0e7d8a', logo: 'AP', category: 'Cultural', members: 138, followers: 902, about: 'APC is a coalition of Asian Pacific student organizations focused on advocacy and community.', founded: 1991 },
  { id: 'o9', name: 'Bruin Democrats', short: 'BD', tagline: 'Political organizing and civic engagement.', color: '#2c5d8a', logo: 'DM', category: 'Political', members: 62, followers: 488, about: 'Bruin Dems organizes for local and national candidates and runs voter registration drives.', founded: 2008 },
  { id: 'o10', name: 'Sunset Hiking Club', short: 'SHC', tagline: 'Weekend hikes around LA.', color: '#0f6f5c', logo: 'SH', category: 'Recreation', members: 118, followers: 1004, about: 'Weekend hikes around LA. All levels welcome — we always have a beginner-friendly group.', founded: 2019 },
]

export const EVENTS: Event[] = [
  { id: 'e1', orgId: 'o1', title: 'Spring GBM', date: day(2), location: 'Boelter 3400', description: 'General body meeting.', visibility: 'public', rsvps: 112 },
  { id: 'e2', orgId: 'o1', title: 'Hackathon Kickoff', date: day(5, 10), location: 'Pauley Pavilion', description: 'Opening ceremony for spring hackathon.', visibility: 'followers', rsvps: 168 },
  { id: 'e3', orgId: 'o2', title: 'Startup Pitch Night', date: day(3, 19), location: 'Anderson 2317', description: 'Students pitch to alumni founders.', visibility: 'public', rsvps: 47 },
  { id: 'e4', orgId: 'o3', title: 'Screening: Mulholland Drive', date: day(1, 20), location: 'James Bridges Theater', description: 'Monthly film screening.', visibility: 'public', rsvps: 64 },
  { id: 'e5', orgId: 'o4', title: 'Case Workshop', date: day(4, 17), location: 'Gold 1330', description: 'Members-only case prep session.', visibility: 'members', rsvps: 22 },
  { id: 'e6', orgId: 'o5', title: 'MCAT Study Session', date: day(2, 14), location: 'Powell Library', description: 'Group study session.', visibility: 'followers', rsvps: 41 },
  { id: 'e7', orgId: 'o7', title: 'Beginner Waltz Workshop', date: day(6, 18), location: 'Ackerman Grand Ballroom', description: 'No experience needed.', visibility: 'public', rsvps: 89 },
  { id: 'e8', orgId: 'o8', title: 'Culture Night Planning', date: day(7, 19), location: 'Kerckhoff 131', description: 'Planning meeting for Culture Night.', visibility: 'members', rsvps: 38 },
  { id: 'e9', orgId: 'o9', title: 'Voter Registration Drive', date: day(0, 11), location: 'Bruin Plaza', description: 'Help register voters on campus.', visibility: 'public', rsvps: 24 },
  { id: 'e10', orgId: 'o10', title: 'Griffith Park Hike', date: day(9, 8), location: 'Griffith Observatory', description: 'Easy 5-mile loop.', visibility: 'public', rsvps: 18 },
]

export const ANNOUNCEMENTS: Announcement[] = [
  { id: 'an1', orgId: 'o1', title: 'Applications open', body: 'Apply to join ACM by May 15.', visibility: 'public', posted: day(-3), reactions: { '👏': 14 } },
  { id: 'an2', orgId: 'o2', title: 'Spring cohort accepted', body: 'Congrats to everyone accepted. Check your email.', visibility: 'followers', posted: day(-1), reactions: { '🎉': 22 } },
  { id: 'an3', orgId: 'o4', title: 'Case comp results', body: 'Congrats to our winning team from last weekend.', visibility: 'members', posted: day(-2), reactions: { '🔥': 8 } },
  { id: 'an4', orgId: 'o9', title: 'Rally this Saturday', body: 'Meet at Janss Steps at noon.', visibility: 'public', posted: day(0), urgent: true, reactions: { '💪': 11 } },
  { id: 'an5', orgId: 'o7', title: 'Competition schedule posted', body: 'Check the schedule pinned in the members tab.', visibility: 'followers', posted: day(-4) },
]

export const APPLICATIONS: Application[] = [
  { id: 'app1', orgId: 'o4', name: 'Spring 2026 Analyst Application', deadline: day(14), status: 'open', submissions: 64, capacity: 12, questions: ['Why Bruin Consulting, and why now?', 'Describe a time you solved a complex problem.'] },
  { id: 'app2', orgId: 'o2', name: 'Founder Fellowship · Fall 2026', deadline: day(7), status: 'open', submissions: 38, capacity: 6, questions: ['What startup idea are you working on?', 'What skills do you bring to the community?'] },
  { id: 'app3', orgId: 'o8', name: 'APC Officer Application', deadline: day(-2), status: 'closed', submissions: 41, capacity: 8, questions: ['How have you engaged with the APA community at UCLA?'] },
]

export const APPLICANTS: Applicant[] = [
  { id: 'apl1', name: 'Jordan Lee', initials: 'JL', major: 'Econ · 2nd year', applicationId: 'app1', orgId: 'o4', submitted: day(-1, 14, 22), status: 'pending', answers: ['Strategy fascinates me.', 'Fixed a broken deployment pipeline under deadline.'] },
  { id: 'apl2', name: 'Maya Patel', initials: 'MP', major: 'Business Econ · 3rd year', applicationId: 'app1', orgId: 'o4', submitted: day(-2, 9, 11), status: 'pending', answers: ['I want to break into consulting.', 'Led a team redesign of a legacy codebase.'] },
  { id: 'apl3', name: 'Chris Wu', initials: 'CW', major: 'Public Affairs · 2nd year', applicationId: 'app1', orgId: 'o4', submitted: day(-3, 20, 4), status: 'accepted', answers: ['To sharpen my business thinking.', 'Optimized a slow database query.'] },
  { id: 'apl4', name: 'Sofia Torres', initials: 'ST', major: 'Design · 2nd year', applicationId: 'app2', orgId: 'o2', submitted: day(-3, 11, 30), status: 'pending', answers: ['EdTech platform for first-gen students.', 'Product design and user research.'] },
  { id: 'apl5', name: 'Daniel Kim', initials: 'DK', major: 'CS · 4th year', applicationId: 'app2', orgId: 'o2', submitted: day(-4, 16, 50), status: 'rejected', answers: ['A carbon offset marketplace.', 'Full-stack dev, some ML.'] },
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
    o4: 'member',
    o5: 'visitor',
    o6: 'visitor',
    o7: 'follower',
    o8: 'visitor',
    o9: 'visitor',
    o10: 'visitor',
  },
}
