/* Hook that loads the list of organizations for the discover page */
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
