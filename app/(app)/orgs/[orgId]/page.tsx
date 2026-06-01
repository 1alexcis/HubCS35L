'use client'
import { useParams, useRouter } from 'next/navigation'
import { ORGS, EVENTS, ME } from '@/lib/data'
import type { Event, Visibility } from '@/lib/types'
import { fmtDate, fmtTime } from '@/lib/format'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge, VisibilityChip } from '@/components/ui/badge'
import { OrgLogo } from '@/components/ui/org-logo'
import { Icon } from '@/components/ui/icon'

export default function OrgPage() {
  const { orgId } = useParams<{ orgId: string }>()
  const router = useRouter()
  const org = ORGS.find((o) => o.id === orgId)
  if (!org) return <p className="text-ink-2">Org not found.</p>

  const role = ME.roles[orgId] ?? 'guest'
  const isAdmin = role === 'admin' || orgId === ME.adminOf
  const isFollower = role === 'follower' || isAdmin
  const isGuest = !isAdmin && !isFollower
  const canSee = (v: Visibility) => v === 'public' || v === 'followers'

  const events = EVENTS.filter((e) => e.orgId === orgId)
  const visibleEvents = events.filter((e) => canSee(e.visibility))
  const hiddenEvents = events.length - visibleEvents.length

  const eventsForDisplay = visibleEvents
    .slice()
    .sort((a, b) => b.date.getTime() - a.date.getTime())

  return (
    <div className="-m-6">
      <div
        className="h-40"
        style={{
          background: `linear-gradient(135deg, ${org.color} 0%, color-mix(in oklch, ${org.color} 55%, #0e1a36) 100%)`,
        }}
      />
      <div className="mx-auto max-w-[1100px] px-10 pb-16">
        <div className="-mt-[42px] mb-6">
          <div className="w-[84px] rounded-[18px]" style={{ boxShadow: '0 0 0 4px var(--bg-0)' }}>
            <OrgLogo org={org} size={84} radius={18} />
          </div>
        </div>

        <div className="mb-2 flex items-start gap-5">
          <div className="min-w-0 flex-1">
            <h1 className="font-serif font-medium text-ink-1" style={{ fontSize: 28, letterSpacing: '-0.02em' }}>
              {org.name}
            </h1>
            <div className="mt-1 text-[13.5px] text-ink-3">
              {org.category} · Founded {org.founded} · {org.followers.toLocaleString()} followers
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            {isAdmin ? (
              <>
                <Button icon="settings" onClick={() => router.push('/admin')}>
                  Admin panel
                </Button>
                <Button variant="primary" icon="plus" onClick={() => router.push('/admin')}>
                  Post event
                </Button>
              </>
            ) : role === 'follower' ? (
              <Button variant="soft" icon="check">
                Following
              </Button>
            ) : (
              <Button variant="primary" icon="plus">
                Follow
              </Button>
            )}
          </div>
        </div>

        <RoleBanner role={role} hiddenEvents={hiddenEvents} />

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
                  <EventRow key={event.id} e={event} locked={isGuest && event.visibility === 'followers'} />
                ))}
              </div>
            )}
          </div>

          <aside className="flex flex-col gap-4">
            <Card>
              <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-3">About</div>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-2">{org.about}</p>
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
            You&apos;re viewing this org as a visitor. <strong className="text-ink-1">Follow</strong> to see
            follower-only posts and apply to open recruitment.
          </div>
          <Button variant="primary" size="sm" icon="plus">
            Follow
          </Button>
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

function EventRow({ e, locked = false }: { e: Event; locked?: boolean }) {
  return (
    <Card padding={0} hoverable>
      <div className="grid grid-cols-[76px_1fr_auto] items-center">
        <div className="border-r border-border py-3.5 text-center">
          <div className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-3">
            {fmtDate(e.date).split(' ')[0]}
          </div>
          <div className="mt-1 font-serif text-[26px] font-medium leading-none text-ink-1">{e.date.getDate()}</div>
          <div className="mt-1 text-[11px] text-ink-3">{fmtTime(e.date)}</div>
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
              {e.location} · {e.rsvps} going
            </div>
          )}
        </div>
        <div className="p-3.5">
          {locked ? (
            <Button variant="soft" size="sm" icon="lock">
              Locked
            </Button>
          ) : (
            <Button variant="secondary" size="sm">
              RSVP
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
