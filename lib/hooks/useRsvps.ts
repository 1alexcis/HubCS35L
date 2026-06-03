import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

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
        const { data: authData } = await supabase.auth.getUser()
        if (!authData.user) return
        const { data: rows } = await supabase
          .from('rsvps')
          .select('*')
          .eq('user_id', authData.user.id)
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
