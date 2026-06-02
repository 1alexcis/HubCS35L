import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Membership = {
  id: string
  user_id: string
  org_id: string
  role: 'admin' | 'follower'
  created_at: string
  organizations: {
    id: string
    name: string
    avatar_color: string | null
  }
}

export function useMemberships() {
  const [memberships, setMemberships] = useState<Membership[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      try {
        const { data: authData } = await supabase.auth.getUser()
        if (!authData.user) return
        const { data: rows, error: err } = await supabase
          .from('memberships')
          .select('*, organizations(*)')
          .eq('user_id', authData.user.id)
        if (err) setError(err.message)
        else setMemberships((rows ?? []) as Membership[])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [tick])

  function getRole(orgId: string): 'admin' | 'follower' | null {
    return memberships.find(m => m.org_id === orgId)?.role ?? null
  }

  function refetch() {
    setTick(t => t + 1)
  }

  return { memberships, loading, error, getRole, refetch }
}
