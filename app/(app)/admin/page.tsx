'use client'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getCurrentUserId } from '@/lib/supabase/current-user'
import type { Visibility } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { VisibilityChip } from '@/components/ui/badge'
import { OrgLogo } from '@/components/ui/org-logo'
import { Icon, type IconName } from '@/components/ui/icon'

type DBOrg = {
  id: string
  name: string
  description: string | null
  category: string | null
  avatar_color: string | null
}
type AdminMembership = {
  organizations: DBOrg | DBOrg[] | null
}

type Composer = 'event' | 'settings'
type EventDraft = {
  title: string
  date: string
  time: string
  location: string
  description: string
  visibility: Visibility
}

const NAV: { id: Composer; icon: IconName; label: string }[] = [
  { id: 'event', icon: 'calendar', label: 'Post event' },
]

const FIELD = 'w-full rounded-lg border border-border bg-bg-1 px-3 py-2.5 text-[13.5px] text-ink-1 outline-none'
const TODAY = new Date().toISOString().slice(0, 10)

export default function AdminPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const requestedOrgId = searchParams.get('orgId')
  const [composer, setComposer] = useState<Composer>('event')
  const [org, setOrg] = useState<DBOrg | null>(null)
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState('')
  const [event, setEvent] = useState<EventDraft>({
    title: '',
    date: TODAY,
    time: '19:00',
    location: '',
    description: '',
    visibility: 'public',
  })

  useEffect(() => {
    const supabase = createClient()
    async function loadAdminOrg() {
      try {
        // Use the E2E test user when configured; otherwise use normal Supabase auth.
        const userId = await getCurrentUserId(supabase)
        if (!userId) return

        const { data, error: err } = await supabase
          .from('memberships')
          .select('organizations(*)')
          .eq('user_id', userId)
          .eq('role', 'admin')

        if (err) {
          setError(err.message)
          return
        }

        const adminOrgs = ((data ?? []) as AdminMembership[])
          .map((m) => Array.isArray(m.organizations) ? m.organizations[0] : m.organizations)
          .filter((o): o is DBOrg => Boolean(o))
        setOrg(adminOrgs.find((o) => o.id === requestedOrgId) ?? adminOrgs[0] ?? null)
      } finally {
        setLoading(false)
      }
    }
    loadAdminOrg()
  }, [requestedOrgId])

  async function handlePostEvent(e: React.FormEvent) {
    e.preventDefault()
    if (!org) {
      setError('An admin org is required to post an event.')
      return
    }

    const title = event.title.trim()
    if (!title || !event.date || !event.time || !event.visibility) {
      setError('Title, date, time, and visibility are required.')
      return
    }

    setPosting(true)
    setError('')
    const supabase = createClient()
    const { error: err } = await supabase.from('events').insert({
      org_id: org.id,
      title,
      start_time: new Date(`${event.date}T${event.time}`).toISOString(),
      location: event.location.trim(),
      description: event.description.trim(),
      visibility: event.visibility,
    })

    if (err) {
      setError(err.message)
      setPosting(false)
      return
    }

    router.push(`/orgs/${org.id}`)
  }

  if (loading) return <div className="p-8 text-sm text-ink-3">Loading...</div>
  if (!org) return <div className="p-8 text-sm text-ink-3">No admin org found.</div>

  return (
    <div className="mx-auto max-w-[1240px]">
      <div className="mb-3.5 flex items-center gap-2.5 text-[12.5px] text-ink-3">
        <button onClick={() => router.push(`/orgs/${org.id}`)} className="hover:text-ink-1">
          {org.name}
        </button>
        <Icon name="chev_r" size={12} />
        <span className="font-medium text-ink-1">Admin</span>
      </div>

      <div className="mb-6">
        <h1 className="font-serif font-medium text-ink-1" style={{ fontSize: 30, letterSpacing: '-0.02em' }}>
          Admin panel
        </h1>
        <div className="mt-1 text-[13.5px] text-ink-3">
          Manage events for {org.name}.
        </div>
      </div>

      <div className="grid grid-cols-[240px_1fr] gap-7">
        <aside>
          <Card padding={6}>
            {NAV.map((t) => {
              const on = composer === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => setComposer(t.id)}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[13.5px] ${
                    on ? 'bg-bg-2 font-medium text-ink-1' : 'text-ink-2 hover:bg-bg-2'
                  }`}
                >
                  <Icon name={t.icon} size={15} />
                  {t.label}
                </button>
              )
            })}
          </Card>
        </aside>

        <div>
          {error && <div className="mb-3 text-sm" style={{ color: '#a83a3a' }}>{error}</div>}
          {composer === 'event' && (
            <EventComposer
              org={org}
              event={event}
              setEvent={setEvent}
              posting={posting}
              onSubmit={handlePostEvent}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-ink-2">{label}</label>
      {children}
      {hint && <div className="text-[11.5px] text-ink-3">{hint}</div>}
    </div>
  )
}

const VIS_OPTS: { id: Visibility; icon: IconName; label: string; desc: string }[] = [
  { id: 'public', icon: 'globe', label: 'Public', desc: 'Anyone on ClubHub' },
  { id: 'followers', icon: 'eye', label: 'Followers', desc: 'People who follow this org' },
]

function VisibilityPicker({ value, onChange }: { value: Visibility; onChange: (v: Visibility) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {VIS_OPTS.map((o) => {
        const on = value === o.id
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className="rounded-lg px-3 py-2.5 text-left"
            style={{
              border: `1.5px solid ${on ? 'var(--accent)' : 'var(--border)'}`,
              background: on ? 'color-mix(in oklch, var(--accent) 6%, var(--bg-1))' : 'var(--bg-1)',
            }}
          >
            <div className="flex items-center gap-1.5" style={{ color: on ? 'var(--accent)' : 'var(--ink-2)' }}>
              <Icon name={o.icon} size={13} />
              <span className="text-[13px] font-medium">{o.label}</span>
            </div>
            <div className="mt-1 text-[11.5px] text-ink-3">{o.desc}</div>
          </button>
        )
      })}
    </div>
  )
}

function EventComposer({
  org,
  event,
  setEvent,
  posting,
  onSubmit,
}: {
  org: DBOrg
  event: EventDraft
  setEvent: (e: EventDraft) => void
  posting: boolean
  onSubmit: (e: React.FormEvent) => void
}) {
  return (
    <div className="grid grid-cols-[1.2fr_1fr] items-start gap-5">
      <Card>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-3">New event</div>
            <h2 className="mt-1 font-serif font-medium text-ink-1" style={{ fontSize: 22, letterSpacing: '-0.015em' }}>
              Add to your org calendar
            </h2>
          </div>
          <Field label="Title">
            <input required className={FIELD} value={event.title} onChange={(e) => setEvent({ ...event, title: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date">
              <input required type="date" className={FIELD} value={event.date} onChange={(e) => setEvent({ ...event, date: e.target.value })} />
            </Field>
            <Field label="Time">
              <input required type="time" className={FIELD} value={event.time} onChange={(e) => setEvent({ ...event, time: e.target.value })} />
            </Field>
          </div>
          <Field label="Location">
            <input required className={FIELD} value={event.location} onChange={(e) => setEvent({ ...event, location: e.target.value })} />
          </Field>
          <Field label="Description">
            <textarea
              rows={4}
              className={`${FIELD} resize-y leading-normal`}
              value={event.description}
              onChange={(e) => setEvent({ ...event, description: e.target.value })}
            />
          </Field>
          <Field label="Who can see this?" hint="Permissions match your org's audience tiers.">
            <VisibilityPicker value={event.visibility} onChange={(v) => setEvent({ ...event, visibility: v })} />
          </Field>
          <div className="mt-1 flex justify-end">
            <Button variant="primary" icon="check" type="submit" disabled={posting}>
              {posting ? 'Posting...' : 'Post event'}
            </Button>
          </div>
        </form>
      </Card>

      <div className="sticky top-6">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-3">Live preview</div>
        <Card padding={0}>
          <div className="grid grid-cols-[76px_1fr] items-center">
            <div className="border-r border-border py-3.5 text-center">
              <div className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-3">
                {event.date ? new Date(`${event.date}T00:00:00`).toLocaleDateString('en-US', { month: 'short' }) : '—'}
              </div>
              <div className="mt-1 font-serif text-[26px] font-medium leading-none text-ink-1">
                {event.date ? new Date(`${event.date}T00:00:00`).getDate() : '—'}
              </div>
              <div className="mt-1 text-[11px] text-ink-3">{event.time || '—'}</div>
            </div>
            <div className="min-w-0 px-4 py-3.5">
              <div className="mb-1 flex items-center gap-2">
                <OrgLogo org={{ color: org.avatar_color ?? '#4F46E5', logo: org.name.slice(0, 2).toUpperCase() }} size={18} radius={4} />
                <div className="text-[12px] font-medium text-ink-3">{org.name}</div>
                <VisibilityChip visibility={event.visibility} />
              </div>
              <div className="text-[15px] font-medium text-ink-1">{event.title || 'Untitled event'}</div>
              <div className="mt-1 text-[12.5px] text-ink-3">{event.location || 'Location TBD'}</div>
            </div>
          </div>
        </Card>
        <div className="mt-4 rounded-[10px] bg-bg-2 p-3.5 text-[12.5px] leading-normal text-ink-2">
          <strong className="text-ink-1">Audience preview.</strong>{' '}
          {event.visibility === 'public' && 'Visible to everyone, including non-followers.'}
          {event.visibility === 'followers' && 'Visible to followers of this org.'}
        </div>
      </div>
    </div>
  )
}

