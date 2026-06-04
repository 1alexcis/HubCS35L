/* Hook that exposes the currently signed in user */
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { E2E_USER_EMAIL, getE2EUserId } from '@/lib/supabase/current-user'
import type { User } from '@supabase/supabase-js'

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const e2eUserId = getE2EUserId()
    if (e2eUserId) {
      setUser({
        id: e2eUserId,
        email: E2E_USER_EMAIL,
        user_metadata: { full_name: 'ClubHub Test User' },
      } as unknown as User)
      setLoading(false)
      return
    }

    const supabase = createClient()
    supabase.auth.getUser()
      .then(({ data }) => setUser(data.user))
      .finally(() => setLoading(false))
  }, [])

  return { user, loading }
}
