/* Hook that loads the data shown on the dashboard for the current user */
import { useEffect, useState } from 'react'
import { listMyMemberships, listMyRsvps, listEventsForOrgs, listEventsByIds } from '@/lib/db'

export type DashEvent = {
  id: string
  org_id: string
  title: string
  start_time: string
  end_time: string | null
  location: string | null
  description: string | null
  visibility: 'public' | 'followers'
  created_at: string
  organizations: { name: string; avatar_color?: string | null } | null
}

export type DashMembership = {
  id: string
  user_id: string
  org_id: string
  role: 'admin' | 'follower'
  organizations: {
    id: string
    name: string
    avatar_color: string | null
    category: string | null
    description: string | null
  } | null
}
type DashRsvp = {
  event_id: string
}

function dedupeEvents(events: DashEvent[]) {
  return Array.from(new Map(events.map((event) => [event.id, event])).values())
}

export function useDashboard() {
  const [upcomingEvents, setUpcomingEvents] = useState<DashEvent[]>([])
  const [recentEvents, setRecentEvents] = useState<DashEvent[]>([])
  const [memberships, setMemberships] = useState<DashMembership[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [membershipRows, rsvpRows] = await Promise.all([
          listMyMemberships(20),
          listMyRsvps(),
        ]) as [DashMembership[], DashRsvp[]]
        setMemberships(membershipRows)

        const orgIds = membershipRows.map((m) => m.org_id)
        const eventIds = rsvpRows.map((r) => r.event_id)
        const eventQueries = []

        if (orgIds.length > 0) eventQueries.push(listEventsForOrgs(orgIds))
        if (eventIds.length > 0) eventQueries.push(listEventsByIds(eventIds))

        const eventResults = await Promise.all(eventQueries)
        const events = dedupeEvents(eventResults.flat() as DashEvent[])
        const now = new Date()

        setUpcomingEvents(
          events
            .filter((event) => new Date(event.start_time) >= now)
            .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
            .slice(0, 10)
        )
        setRecentEvents(
          events
            .filter((event) => new Date(event.start_time) >= now)
            .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
            .slice(0, 10)
        )
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return { upcomingEvents, recentEvents, memberships, loading }
}
