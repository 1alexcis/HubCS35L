/* Data access layer: all Supabase reads and writes live here so the React layer never touches the database directly */
import { createClient } from '@/lib/supabase/client'
import { getCurrentUserId } from '@/lib/supabase/current-user'

// ---- organizations ----

export async function listOrganizations() {
  const { data } = await createClient().from('organizations').select('*').order('name')
  return data ?? []
}

export async function getOrgWithEvents(orgId: string) {
  const { data } = await createClient()
    .from('organizations')
    .select('*, events(*)')
    .eq('id', orgId)
    .single()
  return data
}

// Creates an org and makes the current user its admin, returning the new org id.
export async function createOrgAsAdmin(name: string, description: string) {
  const supabase = createClient()
  const userId = await getCurrentUserId(supabase)
  if (!userId) throw new Error('You need to be logged in to create an org.')

  const { data: org, error: orgErr } = await supabase
    .from('organizations')
    .insert({ name, description })
    .select('id')
    .single()
  if (orgErr || !org) throw new Error(orgErr?.message ?? 'Something went wrong creating the org.')

  const { error: membErr } = await supabase
    .from('memberships')
    .insert({ user_id: userId, org_id: org.id, role: 'admin' })
  if (membErr) throw new Error(membErr.message)

  return org.id as string
}

// ---- memberships ----

export async function listMyMemberships(limit?: number) {
  const supabase = createClient()
  const userId = await getCurrentUserId(supabase)
  if (!userId) return []
  let query = supabase.from('memberships').select('*, organizations(*)').eq('user_id', userId)
  if (limit) query = query.limit(limit)
  const { data } = await query
  return data ?? []
}

export async function listMyAdminOrgs() {
  const supabase = createClient()
  const userId = await getCurrentUserId(supabase)
  if (!userId) return []
  const { data } = await supabase
    .from('memberships')
    .select('organizations(*)')
    .eq('user_id', userId)
    .eq('role', 'admin')
  return data ?? []
}

export async function followOrg(orgId: string) {
  const supabase = createClient()
  const userId = await getCurrentUserId(supabase)
  if (!userId) return
  await supabase.from('memberships').insert({ user_id: userId, org_id: orgId, role: 'follower' })
}

export async function unfollowOrg(orgId: string) {
  const supabase = createClient()
  const userId = await getCurrentUserId(supabase)
  if (!userId) return
  await supabase.from('memberships').delete().eq('user_id', userId).eq('org_id', orgId)
}

// ---- events ----

export async function createEvent(input: {
  orgId: string
  title: string
  startTime: string
  location: string
  description: string
  visibility: 'public' | 'followers'
}) {
  const { error } = await createClient().from('events').insert({
    org_id: input.orgId,
    title: input.title,
    start_time: input.startTime,
    location: input.location,
    description: input.description,
    visibility: input.visibility,
  })
  if (error) throw new Error(error.message)
}

export async function listEventsForOrgs(orgIds: string[]) {
  const { data } = await createClient()
    .from('events')
    .select('*, organizations(name)')
    .in('org_id', orgIds)
  return data ?? []
}

export async function listEventsByIds(eventIds: string[]) {
  const { data } = await createClient()
    .from('events')
    .select('*, organizations(name)')
    .in('id', eventIds)
  return data ?? []
}

// ---- rsvps ----

export async function listMyRsvps() {
  const supabase = createClient()
  const userId = await getCurrentUserId(supabase)
  if (!userId) return []
  const { data } = await supabase.from('rsvps').select('*').eq('user_id', userId)
  return data ?? []
}

export async function addRsvp(eventId: string) {
  const supabase = createClient()
  const userId = await getCurrentUserId(supabase)
  if (!userId) return
  await supabase.from('rsvps').insert({ user_id: userId, event_id: eventId })
}

export async function removeRsvp(eventId: string) {
  const supabase = createClient()
  const userId = await getCurrentUserId(supabase)
  if (!userId) return
  await supabase.from('rsvps').delete().eq('user_id', userId).eq('event_id', eventId)
}

// Returns a map of event id to its current RSVP count.
export async function countRsvpsForEvents(eventIds: string[]) {
  const { data } = await createClient().from('rsvps').select('event_id').in('event_id', eventIds)
  const counts: Record<string, number> = {}
  for (const row of data ?? []) counts[row.event_id] = (counts[row.event_id] ?? 0) + 1
  return counts
}
