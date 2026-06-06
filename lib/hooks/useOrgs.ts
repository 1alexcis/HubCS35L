// [GenAI Use] Prompt: "Role: Next.js and Supabase expert. Context: Building a Next.js App Router app with Supabase. Task: Create lib/hooks/useOrgs.ts that queries supabase.from('organizations').select('*').order('name') on mount. Return { orgs, loading, error } where loading initializes true and sets false in the finally block. Import browser client from lib/supabase/client.ts. No React imports beyond useState and useEffect."
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
// [GenAI Use] Reflection: The hook that AI generated matched the structure I needed. However, after reviewing it deeper I found that useMemberships had a shared state problem where each component calling the hook independently had its own state instance. I redesigned it as a React Context entirely on my own to fix this.
