'use client'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getCurrentUserId } from '@/lib/supabase/current-user'
import { useDashboard, type DashEvent } from '@/lib/hooks/useDashboard'
import { useRsvps } from '@/lib/hooks/useRsvps'
import { roleForOrg, canViewEvent } from '@/lib/visibility'
import { fmtDate, fmtTime } from '@/lib/format'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SectionHeader } from '@/components/ui/section-header'
import { OrgLogo } from '@/components/ui/org-logo'
import { Icon } from '@/components/ui/icon'

const greetingDate = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
}).format(new Date())

function orgProps(org: DashEvent['organizations']) {
  return { color: org?.avatar_color ?? '#4F46E5', logo: (org?.name ?? '??').slice(0, 2).toUpperCase() }
}

export default function DashboardPage() {
  const router = useRouter()
  const { upcomingEvents, memberships, loading } = useDashboard()
  const { hasRsvp, refetch: refetchRsvps } = useRsvps()

  const roleMap = Object.fromEntries(memberships.map(m => [m.org_id, m.role]))
  const visibleUpcoming = upcomingEvents.filter(e =>
    canViewEvent(e.visibility, roleForOrg(roleMap, e.org_id))
  )

  if (loading) return <div className="p-8 text-sm text-ink-3">Loading...</div>

  async function handleRsvp(eventId: string) {
    const supabase = createClient()
    // Use the E2E test user when configured; otherwise use normal Supabase auth.
    const userId = await getCurrentUserId(supabase)
    if (!userId) return
    if (hasRsvp(eventId)) {
      await supabase.from('rsvps').delete().eq('user_id', userId).eq('event_id', eventId)
    } else {
      await supabase.from('rsvps').insert({ user_id: userId, event_id: eventId })
    }
    refetchRsvps()
  }

  return (
    <div className="mx-auto max-w-[1240px]">
      <div className="mb-7">
        <div className="text-[12.5px] font-medium uppercase tracking-[0.04em] text-ink-3">{greetingDate}</div>
        <h1
          className="mt-1.5 font-serif font-medium leading-tight text-ink-1"
          style={{ fontSize: 32, letterSpacing: '-0.02em' }}
        >
          Good afternoon.
        </h1>
        <div className="mt-1.5 text-sm text-ink-3">
          {visibleUpcoming.length} upcoming events · {memberships.length} orgs followed
        </div>
      </div>

      <div className="grid grid-cols-[1.55fr_1fr] gap-7">
        {/* LEFT */}
        <div className="flex flex-col gap-7">
          <section>
            <SectionHeader
              title="Upcoming"
              subtitle="Events from your orgs and RSVPs"
            />
            <div className="flex flex-col gap-2.5">
              {visibleUpcoming.map((e) => {
                const d = new Date(e.start_time)
                return (
                  <Card key={e.id} padding={0} hoverable onClick={() => router.push(`/orgs/${e.org_id}`)}>
                    <div className="grid grid-cols-[76px_1fr_auto] items-stretch">
                      <div className="border-r border-border py-3.5 text-center">
                        <div className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-3">
                          {fmtDate(d).split(' ')[0]}
                        </div>
                        <div className="mt-1 font-serif text-[26px] font-medium leading-none text-ink-1">
                          {d.getDate()}
                        </div>
                        <div className="mt-1 text-[11px] text-ink-3">{fmtTime(d)}</div>
                      </div>
                      <div className="min-w-0 px-4 py-3.5">
                        <div className="mb-1 flex items-center gap-2">
                          <OrgLogo org={orgProps(e.organizations)} size={18} radius={4} />
                          <div className="text-[12px] font-medium text-ink-3">{e.organizations?.name}</div>
                        </div>
                        <div className="text-[15px] font-medium text-ink-1">{e.title}</div>
                        {e.location && (
                          <div className="mt-1.5 flex items-center gap-1.5 text-[12.5px] text-ink-3">
                            <Icon name="pin" size={12} /> {e.location}
                          </div>
                        )}
                      </div>
                      <div className="grid place-items-center p-3.5">
                        <Button
                          variant={hasRsvp(e.id) ? 'soft' : 'secondary'}
                          size="sm"
                          icon={hasRsvp(e.id) ? 'check' : undefined}
                          onClick={(ev) => { ev.stopPropagation(); handleRsvp(e.id) }}
                        >
                          {hasRsvp(e.id) ? 'Going' : 'RSVP'}
                        </Button>
                      </div>
                    </div>
                  </Card>
                )
              })}
              {visibleUpcoming.length === 0 && (
                <Card>
                  <div className="py-6 text-center text-sm text-ink-3">No upcoming events.</div>
                </Card>
              )}
            </div>
          </section>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-7">
          <section>
            <SectionHeader title="Your RSVPs" />
            <div className="flex flex-col gap-2.5">
              {upcomingEvents.filter((e) => hasRsvp(e.id)).map((e) => {
                const d = new Date(e.start_time)
                return (
                  <Card key={e.id} hoverable onClick={() => router.push(`/orgs/${e.org_id}`)}>
                    <div className="mb-2 flex items-center gap-2.5">
                      <OrgLogo org={orgProps(e.organizations)} size={22} radius={5} />
                      <div className="text-[12.5px] font-medium text-ink-2">{e.organizations?.name}</div>
                      <span className="text-[11.5px] text-ink-3">·</span>
                      <span className="text-[11.5px] text-ink-3">{fmtDate(d)}</span>
                    </div>
                    <div className="text-[14.5px] font-medium text-ink-1">{e.title}</div>
                    {e.location && (
                      <div className="mt-1 flex items-center gap-1.5 text-[12.5px] text-ink-3">
                        <Icon name="pin" size={12} /> {e.location}
                      </div>
                    )}
                  </Card>
                )
              })}
              {upcomingEvents.filter((e) => hasRsvp(e.id)).length === 0 && (
                <Card>
                  <div className="py-5 text-center text-sm text-ink-3">No RSVPs yet.</div>
                </Card>
              )}
            </div>
          </section>

          <section>
            <SectionHeader
              title="Following"
              action={
                <Button variant="ghost" size="sm" onClick={() => router.push('/discover')}>
                  Browse all
                </Button>
              }
            />
            <Card padding={0}>
              {memberships.map((m, i) => {
                const org = m.organizations
                return (
                  <div
                    key={m.id}
                    onClick={() => router.push(`/orgs/${m.org_id}`)}
                    className={`flex cursor-pointer items-center gap-3 px-3.5 py-2.5 hover:bg-bg-2 ${
                      i === 0 ? '' : 'border-t border-border'
                    }`}
                  >
                    <OrgLogo
                      org={{ color: org?.avatar_color ?? '#4F46E5', logo: (org?.name ?? '??').slice(0, 2).toUpperCase() }}
                      size={28}
                      radius={6}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-[13.5px] font-medium text-ink-1">{org?.name}</div>
                      <div className="text-[11.5px] text-ink-3">
                        {m.role === 'admin' ? 'Admin' : 'Follower'}
                      </div>
                    </div>
                    <Icon name="chev_r" size={14} style={{ color: 'var(--ink-3)' }} />
                  </div>
                )
              })}
              {memberships.length === 0 && (
                <div className="px-3.5 py-4 text-sm text-ink-3">Not following any orgs yet.</div>
              )}
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}
