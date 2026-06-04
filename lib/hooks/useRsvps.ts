import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getCurrentUserId } from '@/lib/supabase/current-user'

type Rsvp = {
  id: string
  user_id: string
  event_id: string
  created_at: string
}

export function useRsvps() {
  const [rsvps, setRsvps] = useState<Rsvp[]>([])
  const [loading, setLoading] = useState(true)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      try {
        // Use the E2E test user when configured; otherwise use normal Supabase auth.
        const userId = await getCurrentUserId(supabase)
        if (!userId) return
        const { data: rows } = await supabase
          .from('rsvps')
          .select('*')
          .eq('user_id', userId)
        setRsvps((rows ?? []) as Rsvp[])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [tick])

  function hasRsvp(eventId: string) {
    return rsvps.some(r => r.event_id === eventId)
  }

  function refetch() {
    setTick(t => t + 1)
  }

  return { rsvps, loading, hasRsvp, refetch }
}
