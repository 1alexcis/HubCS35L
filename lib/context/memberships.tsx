'use client'
/* React context that shares the current user's org memberships across the app */
import { createContext, useContext, useEffect, useState } from 'react'
import { listMyMemberships } from '@/lib/db'

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
  const [refetchCount, setRefetchCount] = useState(0)

  useEffect(() => {
    async function loadMemberships() {
      try {
        setMemberships((await listMyMemberships()) as Membership[])
      } finally {
        setLoading(false)
      }
    }
    loadMemberships()
  }, [refetchCount])

  function getRole(orgId: string): 'admin' | 'follower' | null {
    return memberships.find(m => m.org_id === orgId)?.role ?? null
  }

  function refetch() {
    setRefetchCount(c => c + 1)
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
