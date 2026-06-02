import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

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
  organizations: { name: string; avatar_color: string | null } | null
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
        const { data: authData } = await supabase.auth.getUser()
        if (!authData.user) return

        const userId = authData.user.id
        const [upcomingRes, recentRes, membRes] = await Promise.all([
          supabase
            .from('events')
            .select('*, organizations(name, avatar_color)')
            .gte('start_time', new Date().toISOString())
            .order('start_time')
            .limit(10),
          supabase
            .from('events')
            .select('*, organizations(name, avatar_color)')
            .order('created_at', { ascending: false })
            .limit(10),
          supabase
            .from('memberships')
            .select('*, organizations(*)')
            .eq('user_id', userId)
            .limit(20),
        ])

        if (upcomingRes.error) setError(upcomingRes.error.message)
        else setUpcomingEvents((upcomingRes.data ?? []) as DashEvent[])

        if (recentRes.error) setError(recentRes.error.message)
        else setRecentEvents((recentRes.data ?? []) as DashEvent[])

        if (membRes.error) setError(membRes.error.message)
        else setMemberships((membRes.data ?? []) as DashMembership[])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return { upcomingEvents, recentEvents, memberships, loading, error }
}
