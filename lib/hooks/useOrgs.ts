// [GenAI Use] Prompt: "Role: Next.js and Supabase expert. Context: Next.js App Router app with Supabase. Task: Create lib/hooks/useOrgs.ts that calls listOrganizations() from lib/db on mount. Return { orgs, loading } where loading starts true and turns false in finally."
// [GenAI Use] LLM Response Start
import { useEffect, useState } from 'react'
import { listOrganizations } from '@/lib/db'

type Org = {
  id: string
  name: string
  description: string | null
  category: string | null
  avatar_color: string | null
  created_at: string
}

export function useOrgs() {
  const [orgs, setOrgs] = useState<Org[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        setOrgs(await listOrganizations())
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return { orgs, loading }
}
// [GenAI Use] LLM Response End
// [GenAI Use] Reflection: Hook structure matched what I needed for the codebase. I later found useMemberships (same pattern) had a shared state bug and refactored it into a React Context on my own. So Claude created the boilerplate code, and then I refactored to improve.
