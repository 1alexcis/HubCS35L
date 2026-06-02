import { createClient } from '@supabase/supabase-js'
import { ORGS, EVENTS, ME } from '../lib/data'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// must exist in auth.users before running this
const TEST_USER_ID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'

async function seed() {
  const { error: orgsErr } = await supabase.from('organizations').upsert(
    ORGS.map((o) => ({
      id: o.id,
      name: o.name,
      description: o.about,
      category: o.category,
      avatar_color: o.color,
      created_at: new Date().toISOString(),
    })),
    { onConflict: 'id' }
  )
  if (orgsErr) console.error('orgs:', orgsErr.message)
  else console.log(`seeded ${ORGS.length} organizations`)

  const { error: profileErr } = await supabase.from('profiles').upsert(
    { id: TEST_USER_ID, name: ME.name, email: ME.email, avatar_color: '#4F46E5' },
    { onConflict: 'id' }
  )
  if (profileErr) console.error('profile:', profileErr.message)
  else console.log('seeded test profile')

  const memberships = Object.entries(ME.roles)
    .map(([orgId, role]) => ({
      user_id: TEST_USER_ID,
      org_id: orgId,
      role,
    }))
  const { error: membErr } = await supabase.from('memberships').upsert(memberships, { onConflict: 'user_id,org_id' })
  if (membErr) console.error('memberships:', membErr.message)
  else console.log(`seeded ${memberships.length} memberships`)

  const { error: eventsErr } = await supabase.from('events').upsert(
    EVENTS.map((e) => ({
      id: e.id,
      org_id: e.orgId,
      title: e.title,
      start_time: e.date.toISOString(),
      end_time: null,
      location: e.location,
      description: e.description,
      visibility: e.visibility,
    })),
    { onConflict: 'id' }
  )
  if (eventsErr) console.error('events:', eventsErr.message)
  else console.log(`seeded ${EVENTS.length} events`)
}

seed()

// Run with: npx ts-node supabase/seed.ts
