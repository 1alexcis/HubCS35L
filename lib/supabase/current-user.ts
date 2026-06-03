type SupabaseWithAuth = {
  auth: {
    getUser: () => Promise<{ data: { user: { id: string } | null } }>
  }
}

export const E2E_USER_ID = process.env.NEXT_PUBLIC_UNSAFE_E2E_USER_ID
export const E2E_USER_EMAIL = process.env.NEXT_PUBLIC_E2E_USER_EMAIL ?? 'clubhub-test@g.ucla.edu'

export function getE2EUserId() {
  return E2E_USER_ID?.trim() || null
}

export async function getCurrentUserId(supabase: SupabaseWithAuth) {
  // Use the E2E test user when configured; otherwise use normal Supabase auth.
  const e2eUserId = getE2EUserId()
  if (e2eUserId) return e2eUserId

  const { data: { user } } = await supabase.auth.getUser()
  return user?.id ?? null
}
