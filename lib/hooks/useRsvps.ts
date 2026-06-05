/* Hook that tracks which events the current user has RSVPed to */
import { useEffect, useState } from 'react'
import { listMyRsvps } from '@/lib/db'

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
    async function load() {
      try {
        setRsvps((await listMyRsvps()) as Rsvp[])
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
