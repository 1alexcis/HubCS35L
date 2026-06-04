'use client'
/* React context that shares the current user's org memberships across the app */
import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getCurrentUserId } from '@/lib/supabase/current-user'

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

type MembershipsContextType = {
  memberships: Membership[]
  loading: boolean
  getRole: (orgId: string) => 'admin' | 'follower' | null
  refetch: () => void
}

const MembershipsContext = createContext<MembershipsContextType | null>(null)

export function MembershipsProvider({ children }: { children: React.ReactNode }) {
  const [memberships, setMemberships] = useState<Membership[]>([])
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
          .from('memberships')
          .select('*, organizations(*)')
          .eq('user_id', userId)
        setMemberships((rows ?? []) as Membership[])
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

  return (
    <MembershipsContext.Provider value={{ memberships, loading, getRole, refetch }}>
      {children}
    </MembershipsContext.Provider>
  )
}

export function useMemberships() {
  const ctx = useContext(MembershipsContext)
  if (!ctx) throw new Error('useMemberships must be used inside MembershipsProvider')
  return ctx
}
