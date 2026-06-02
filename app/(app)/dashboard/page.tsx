'use client'
import { useRouter } from 'next/navigation'
import { useDashboard } from '@/lib/hooks/useDashboard'
import { useMemberships } from '@/lib/hooks/useMemberships'
import { fmtDate, fmtTime, relTime } from '@/lib/format'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge, VisibilityChip } from '@/components/ui/badge'
import { SectionHeader } from '@/components/ui/section-header'
import { OrgLogo } from '@/components/ui/org-logo'
import { Icon } from '@/components/ui/icon'

const greetingDate = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
}).format(new Date())

function orgLogo(org: { name: string; avatar_color: string | null } | null) {
  return { color: org?.avatar_color ?? '#4F46E5', logo: org?.name.slice(0, 2).toUpperCase() ?? '??' }
}

export default function DashboardPage() {
  const router = useRouter()
  const { upcomingEvents, recentEvents, memberships, loading } = useDashboard()
  const { getRole } = useMemberships()

  if (loading) return <div className="p-8 text-sm text-ink-3">Loading...</div>

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
          {upcomingEvents.length} upcoming events · {recentEvents.length} recent posts
        </div>
      </div>

      <div className="grid grid-cols-[1.55fr_1fr] gap-7">
        <div className="flex flex-col gap-7">
          <section>
            <SectionHeader
              title="Upcoming"
              subtitle="Events from your followed orgs, next 14 days"
              action={
                <Button variant="ghost" size="sm" iconRight="arrow_r" onClick={() => router.push('/calendar')}>
                  Calendar
                </Button>
              }
            />
            <div className="flex flex-col gap-2.5">
              {upcomingEvents.map((e) => {
                const d = new Date(e.start_time)
                const org = e.organizations
                const canSee = e.visibility === 'public' || getRole(e.org_id) != null
                if (!canSee) return null
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
                          <OrgLogo org={orgLogo(org)} size={18} radius={4} />
                          <div className="text-[12px] font-medium text-ink-3">{org?.name}</div>
                          <VisibilityChip visibility={e.visibility} />
                        </div>
                        <div className="text-[15px] font-medium text-ink-1">{e.title}</div>
                        <div className="mt-1.5 flex items-center gap-3.5 text-[12.5px] text-ink-3">
                          {e.location && (
                            <span className="inline-flex items-center gap-1.5">
                              <Icon name="pin" size={12} /> {e.location}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="grid place-items-center p-3.5">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={(ev) => ev.stopPropagation()}
                        >
                          RSVP
                        </Button>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-7">
          <section>
            <SectionHeader title="Recent updates" />
            <div className="flex flex-col gap-2.5">
              {recentEvents.map((e) => {
                const org = e.organizations
                const canSee = e.visibility === 'public' || getRole(e.org_id) != null
                if (!canSee) return null
                return (
                  <Card key={e.id} hoverable onClick={() => router.push(`/orgs/${e.org_id}`)}>
                    <div className="mb-2 flex items-center gap-2.5">
                      <OrgLogo org={orgLogo(org)} size={22} radius={5} />
                      <div className="text-[12.5px] font-medium text-ink-2">{org?.name}</div>
                      <span className="text-[11.5px] text-ink-3">·</span>
                      <span className="text-[11.5px] text-ink-3">{relTime(new Date(e.created_at))}</span>
                    </div>
                    <div className="text-[14.5px] font-medium text-ink-1">{e.title}</div>
                    {e.description && (
                      <p className="mt-1.5 line-clamp-2 text-[13px] leading-normal text-ink-2">{e.description}</p>
                    )}
                  </Card>
                )
              })}
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
                const o = m.organizations
                if (!o) return null
                return (
                  <div
                    key={m.id}
                    onClick={() => router.push(`/orgs/${m.org_id}`)}
                    className={`flex cursor-pointer items-center gap-3 px-3.5 py-2.5 hover:bg-bg-2 ${
                      i === 0 ? '' : 'border-t border-border'
                    }`}
                  >
                    <OrgLogo org={orgLogo(o)} size={28} radius={6} />
                    <div className="min-w-0 flex-1">
                      <div className="text-[13.5px] font-medium text-ink-1">{o.name}</div>
                      <div className="text-[11.5px] text-ink-3">
                        {m.role === 'admin' ? 'Admin' : 'Follower'}
                      </div>
                    </div>
                    <Icon name="chev_r" size={14} style={{ color: 'var(--ink-3)' }} />
                  </div>
                )
              })}
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}
