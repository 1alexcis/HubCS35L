import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getCurrentUserId } from '@/lib/supabase/current-user'

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
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      try {
        // Use the E2E test user when configured; otherwise use normal Supabase auth.
        const userId = await getCurrentUserId(supabase)
        if (!userId) return

        const [membRes, rsvpRes] = await Promise.all([
          supabase
            .from('memberships')
            .select('*, organizations(*)')
            .eq('user_id', userId)
            .limit(20),
          supabase
            .from('rsvps')
            .select('event_id')
            .eq('user_id', userId),
        ])

        if (membRes.error) setError(membRes.error.message)
        if (rsvpRes.error) setError(rsvpRes.error.message)

        const membershipRows = (membRes.data ?? []) as DashMembership[]
        const rsvpRows = (rsvpRes.data ?? []) as DashRsvp[]
        setMemberships(membershipRows)

        const orgIds = membershipRows.map((m) => m.org_id)
        const eventIds = rsvpRows.map((r) => r.event_id)
        const eventQueries = []

        if (orgIds.length > 0) {
          eventQueries.push(
            supabase
              .from('events')
              .select('*, organizations(name)')
              .in('org_id', orgIds)
          )
        }

        if (eventIds.length > 0) {
          eventQueries.push(
            supabase
              .from('events')
              .select('*, organizations(name)')
              .in('id', eventIds)
          )
        }

        const eventResults = await Promise.all(eventQueries)
        eventResults.forEach((res) => {
          if (res.error) setError(res.error.message)
        })

        const events = dedupeEvents(
          eventResults.flatMap((res) => (res.data ?? []) as DashEvent[])
        )
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

  return { upcomingEvents, recentEvents, memberships, loading, error }
}
