/* Hook that loads the list of organizations for the discover page */
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

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
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      try {
        const { data, error: err } = await supabase.from('organizations').select('*').order('name')
        if (err) setError(err.message)
        else setOrgs(data ?? [])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return { orgs, loading, error }
}
