'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useMemberships } from '@/lib/hooks/useMemberships'
import { useRsvps } from '@/lib/hooks/useRsvps'
import { roleForOrg, canViewEvent } from '@/lib/visibility'
import { fmtDate, fmtTime } from '@/lib/format'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge, VisibilityChip } from '@/components/ui/badge'
import { OrgLogo } from '@/components/ui/org-logo'
import { Icon } from '@/components/ui/icon'

type DBEvent = {
  id: string
  title: string
  start_time: string
  location: string | null
  description: string | null
  visibility: 'public' | 'followers'
}

type DBOrg = {
  id: string
  name: string
  description: string | null
  category: string | null
  avatar_color: string | null
  created_at: string
  events: DBEvent[]
}

export default function OrgPage() {
  const { orgId } = useParams<{ orgId: string }>()
  const router = useRouter()
  const { memberships, loading: membLoading, refetch } = useMemberships()
  const { hasRsvp, refetch: refetchRsvps } = useRsvps()
  const [org, setOrg] = useState<DBOrg | null>(null)
  const [loading, setLoading] = useState(true)
  const [rsvpCounts, setRsvpCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      try {
        const { data } = await supabase
          .from('organizations')
          .select('*, events(*)')
          .eq('id', orgId)
          .single()
        setOrg(data as DBOrg)
        const eventIds = ((data as DBOrg)?.events ?? []).map(e => e.id)
        if (eventIds.length > 0) {
          const { data: rsvpRows } = await supabase
            .from('rsvps')
            .select('event_id')
            .in('event_id', eventIds)
          const counts: Record<string, number> = {}
          for (const row of rsvpRows ?? []) {
            counts[row.event_id] = (counts[row.event_id] ?? 0) + 1
          }
          setRsvpCounts(counts)
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [orgId])

  if (loading || membLoading) return <div className="p-8 text-sm text-ink-3">Loading...</div>
  if (!org) return <p className="text-ink-2">Org not found.</p>

  async function handleFollow() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    if (viewerRole === 'follower') {
      await supabase.from('memberships').delete().eq('user_id', user.id).eq('org_id', orgId)
    } else {
      await supabase.from('memberships').insert({ user_id: user.id, org_id: orgId, role: 'follower' })
    }
    refetch()
  }

  async function handleRsvp(eventId: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    if (hasRsvp(eventId)) {
      await supabase.from('rsvps').delete().eq('user_id', user.id).eq('event_id', eventId)
    } else {
      await supabase.from('rsvps').insert({ user_id: user.id, event_id: eventId })
    }
    refetchRsvps()
  }

  const roleMap = Object.fromEntries(memberships.map(m => [m.org_id, m.role]))
  const viewerRole = roleForOrg(roleMap, orgId)
  const isAdmin = viewerRole === 'admin'
  const isFollower = viewerRole === 'admin' || viewerRole === 'follower'
  const color = org.avatar_color ?? '#4F46E5'

  const eventsForDisplay = (org.events ?? [])
    .slice()
    .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime())

  return (
    <div className="-m-6">
      <div
        className="h-40"
        style={{
          background: `linear-gradient(135deg, ${color} 0%, color-mix(in oklch, ${color} 55%, #0e1a36) 100%)`,
        }}
      />
      <div className="mx-auto max-w-[1100px] px-10 pb-16">
        <div className="-mt-[42px] mb-6">
          <div className="w-[84px] rounded-[18px]" style={{ boxShadow: '0 0 0 4px var(--bg-0)' }}>
            <OrgLogo org={{ color, logo: org.name.slice(0, 2).toUpperCase() }} size={84} radius={18} />
          </div>
        </div>

        <div className="mb-2 flex items-start gap-5">
          <div className="min-w-0 flex-1">
            <h1 className="font-serif font-medium text-ink-1" style={{ fontSize: 28, letterSpacing: '-0.02em' }}>
              {org.name}
            </h1>
            <div className="mt-1 text-[13.5px] text-ink-3">{org.category}</div>
          </div>
          <div className="flex gap-2 pt-1">
            {isAdmin ? (
              <>
                <Button icon="settings" onClick={() => router.push(`/admin?orgId=${org.id}`)}>
                  Admin panel
                </Button>
                <Button variant="primary" icon="plus" onClick={() => router.push(`/admin?orgId=${org.id}`)}>
                  Post event
                </Button>
              </>
            ) : viewerRole === 'follower' ? (
              <Button variant="soft" icon="check" onClick={handleFollow}>
                Following
              </Button>
            ) : (
              <Button variant="primary" icon="plus" onClick={handleFollow}>
                Follow
              </Button>
            )}
          </div>
        </div>

        <RoleBanner role={viewerRole ?? 'guest'} hiddenEvents={0} />

        <div className="mt-6 grid grid-cols-[1fr_280px] gap-8">
          <div>
            <div className="mb-5 flex gap-1 border-b border-border">
              <span className="border-b-2 border-accent px-3.5 py-2.5 text-[13.5px] font-medium text-ink-1">Events</span>
            </div>
            {eventsForDisplay.length === 0 ? (
              <Card>
                <div className="px-4 py-8 text-center text-sm text-ink-3">Nothing posted yet.</div>
              </Card>
            ) : (
              <div className="flex flex-col gap-3">
                {eventsForDisplay.map((event) => (
                  <EventRow
                    key={event.id}
                    e={event}
                    locked={!canViewEvent(event.visibility, viewerRole)}
                    rsvped={hasRsvp(event.id)}
                    onRsvp={() => handleRsvp(event.id)}
                    rsvpCount={isFollower ? (rsvpCounts[event.id] ?? 0) : undefined}
                  />
                ))}
              </div>
            )}
          </div>

          <aside className="flex flex-col gap-4">
            <Card>
              <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-3">About</div>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-2">{org.description}</p>
            </Card>
            <Card>
              <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-3">Visibility</div>
              <div className="mt-2.5 flex flex-col gap-2 text-[12.5px] text-ink-2">
                <div className="flex items-center gap-2">
                  <Icon name="globe" size={13} /> Public posts visible to everyone
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="eye" size={13} /> Follower posts visible to {isFollower ? 'you' : 'followers only'}
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}

function RoleBanner({ role, hiddenEvents }: { role: string; hiddenEvents: number }) {
  const isAdmin = role === 'admin'
  const isFollower = role === 'follower' || isAdmin
  const isGuest = !isAdmin && !isFollower

  if (isGuest) {
    return (
      <Card
        style={{
          borderColor: 'color-mix(in oklch, var(--accent) 30%, var(--border))',
          background: 'color-mix(in oklch, var(--accent) 4%, var(--bg-1))',
        }}
      >
        <div className="flex items-center gap-3">
          <Icon name="eye" size={16} style={{ color: 'var(--accent)' }} />
          <div className="flex-1 text-[13.5px] text-ink-2">
            You&apos;re viewing this org as a guest. <strong className="text-ink-1">Follow</strong> to see
            follower-only posts.
          </div>
        </div>
      </Card>
    )
  }
  if (isAdmin) {
    return (
      <Card
        style={{
          borderColor: 'color-mix(in oklch, var(--gold) 50%, var(--border))',
          background: 'color-mix(in oklch, var(--gold) 8%, var(--bg-1))',
        }}
      >
        <div className="flex items-center gap-3">
          <Icon name="sparkle" size={16} style={{ color: '#7a5a1a' }} />
          <div className="flex-1 text-[13.5px] text-ink-2">
            You&apos;re an admin of this org. You see everything, plus admin controls.
          </div>
        </div>
      </Card>
    )
  }
  if (isFollower) {
    return (
      <div className="px-1 text-[12.5px] text-ink-3">
        {hiddenEvents > 0
          ? `${hiddenEvents} unsupported event${hiddenEvents === 1 ? '' : 's'} hidden.`
          : 'You see all public and follower events.'}
      </div>
    )
  }
  return null
}

function EventRow({
  e,
  locked = false,
  rsvped = false,
  onRsvp,
  rsvpCount,
}: {
  e: DBEvent
  locked?: boolean
  rsvped?: boolean
  onRsvp?: () => void
  rsvpCount?: number
}) {
  const d = new Date(e.start_time)
  return (
    <Card padding={0} hoverable>
      <div className="grid grid-cols-[76px_1fr_auto] items-center">
        <div className="border-r border-border py-3.5 text-center">
          <div className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-3">
            {fmtDate(d).split(' ')[0]}
          </div>
          <div className="mt-1 font-serif text-[26px] font-medium leading-none text-ink-1">{d.getDate()}</div>
          <div className="mt-1 text-[11px] text-ink-3">{fmtTime(d)}</div>
        </div>
        <div className="min-w-0 px-4 py-3.5">
          <div className="mb-1 flex items-center gap-2">
            <Badge icon={locked ? 'lock' : 'calendar'}>{locked ? 'Locked' : 'Event'}</Badge>
            <VisibilityChip visibility={e.visibility} />
          </div>
          <div className="text-[15px] font-medium text-ink-1">{e.title}</div>
          {locked ? (
            <div className="mt-1 text-[12.5px] text-ink-3">Follow this org to view event details.</div>
          ) : (
            <div className="mt-1 text-[12.5px] text-ink-3">
              {e.location}
              {rsvpCount !== undefined && (
                <span className="ml-2 text-ink-3">· {rsvpCount} going</span>
              )}
            </div>
          )}
        </div>
        <div className="p-3.5">
          {locked ? (
            <Button variant="soft" size="sm" icon="lock">
              Locked
            </Button>
          ) : (
            <Button
              variant={rsvped ? 'soft' : 'secondary'}
              size="sm"
              icon={rsvped ? 'check' : undefined}
              onClick={onRsvp}
            >
              {rsvped ? 'Going' : 'RSVP'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
