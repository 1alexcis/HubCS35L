// [GenAI Use] Prompt:
// Start with the RSVPs. Wire up a hook so a user can insert and delete their
// RSVP from the rsvps table. Model it on the useMemberships hook we already
// have so it fits the rest of the codebase, keep it as simple as possible, and
// don't add anything extra since I'm going to be editing it myself.
// [GenAI Use] LLM Response Start
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
// [GenAI Use] LLM Response End
// [GenAI Use] Reflection: I described the behavior I wanted and had Claude model it on useMemberships so it fit the codebase. Claude first put the supabase insert and delete inside the hook, but during our data-access refactor I moved those into lib/db.ts (addRsvp and removeRsvp) and left this hook to just track state and expose hasRsvp and refetch.
