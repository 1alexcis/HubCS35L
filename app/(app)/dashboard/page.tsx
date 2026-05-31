'use client'
import { useRouter } from 'next/navigation'
import { ORGS, EVENTS, ANNOUNCEMENTS, APPLICATIONS, ME, TODAY } from '@/lib/data'
import type { Visibility } from '@/lib/types'
import { fmtDate, fmtTime, relTime } from '@/lib/format'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge, VisibilityChip } from '@/components/ui/badge'
import { SectionHeader } from '@/components/ui/section-header'
import { OrgLogo } from '@/components/ui/org-logo'
import { Icon } from '@/components/ui/icon'

const orgOf = (id: string) => ORGS.find((o) => o.id === id)!

const followed = ORGS.filter(
  (o) => ['follower', 'applicant', 'member', 'admin'].includes(ME.roles[o.id]) || o.id === ME.adminOf,
)
const followedIds = new Set(followed.map((o) => o.id))

function visible(visibility: Visibility, orgId: string): boolean {
  const role = orgId === ME.adminOf ? 'admin' : ME.roles[orgId]
  if (visibility === 'public') return true
  if (visibility === 'followers') return role !== 'visitor'
  if (visibility === 'members') return role === 'member' || role === 'admin'
  return false
}

const upcoming = EVENTS.filter(
  (e) => followedIds.has(e.orgId) && visible(e.visibility, e.orgId) && e.date >= TODAY,
)
  .sort((a, b) => a.date.getTime() - b.date.getTime())
  .slice(0, 6)

const recent = ANNOUNCEMENTS.filter((a) => followedIds.has(a.orgId) && visible(a.visibility, a.orgId))
  .sort((a, b) => b.posted.getTime() - a.posted.getTime())
  .slice(0, 4)

const openApps = APPLICATIONS.filter((a) => a.status === 'open' && followedIds.has(a.orgId))

const newCount = recent.filter((a) => a.posted >= new Date(TODAY.getTime() - 2 * 86_400_000)).length
const greetingDate = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
}).format(TODAY)
const firstName = ME.name.split(' ')[0]

export default function DashboardPage() {
  const router = useRouter()

  return (
    <div className="mx-auto max-w-[1240px]">
      <div className="mb-7">
        <div className="text-[12.5px] font-medium uppercase tracking-[0.04em] text-ink-3">{greetingDate}</div>
        <h1
          className="mt-1.5 font-serif font-medium leading-tight text-ink-1"
          style={{ fontSize: 32, letterSpacing: '-0.02em' }}
        >
          Good afternoon, {firstName}.
        </h1>
        <div className="mt-1.5 text-sm text-ink-3">
          {upcoming.length} upcoming events · {newCount} new announcements · {openApps.length} open applications
        </div>
      </div>

      <div className="grid grid-cols-[1.55fr_1fr] gap-7">
        {/* LEFT */}
        <div className="flex flex-col gap-7">
          <section>
            <SectionHeader
              title="Upcoming"
              subtitle="Events from your followed orgs, next 14 days"
            />
            <div className="flex flex-col gap-2.5">
              {upcoming.map((e) => {
                const org = orgOf(e.orgId)
                const rsvped = ME.rsvped.has(e.id)
                return (
                  <Card key={e.id} padding={0} hoverable onClick={() => router.push(`/orgs/${e.orgId}`)}>
                    <div className="grid grid-cols-[76px_1fr_auto] items-stretch">
                      <div className="border-r border-border py-3.5 text-center">
                        <div className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-ink-3">
                          {fmtDate(e.date).split(' ')[0]}
                        </div>
                        <div className="mt-1 font-serif text-[26px] font-medium leading-none text-ink-1">
                          {e.date.getDate()}
                        </div>
                        <div className="mt-1 text-[11px] text-ink-3">{fmtTime(e.date)}</div>
                      </div>
                      <div className="min-w-0 px-4 py-3.5">
                        <div className="mb-1 flex items-center gap-2">
                          <OrgLogo org={org} size={18} radius={4} />
                          <div className="text-[12px] font-medium text-ink-3">{org.name}</div>
                          <VisibilityChip visibility={e.visibility} />
                        </div>
                        <div className="text-[15px] font-medium text-ink-1">{e.title}</div>
                        <div className="mt-1.5 flex items-center gap-3.5 text-[12.5px] text-ink-3">
                          <span className="inline-flex items-center gap-1.5">
                            <Icon name="pin" size={12} /> {e.location}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Icon name="users" size={12} /> {e.rsvps + (rsvped ? 1 : 0)} going
                          </span>
                        </div>
                      </div>
                      <div className="grid place-items-center p-3.5">
                        <Button
                          variant={rsvped ? 'soft' : 'secondary'}
                          size="sm"
                          icon={rsvped ? 'check' : undefined}
                          onClick={(ev) => ev.stopPropagation()}
                        >
                          {rsvped ? 'Going' : 'RSVP'}
                        </Button>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </section>

          <section>
            <SectionHeader title="Open applications" subtitle="From orgs you follow" />
            <div className="flex flex-col gap-2.5">
              {openApps.map((a) => {
                const org = orgOf(a.orgId)
                const daysLeft = Math.ceil((a.deadline.getTime() - TODAY.getTime()) / 86_400_000)
                const closingSoon = daysLeft <= 7
                return (
                  <Card key={a.id} padding={0} hoverable onClick={() => router.push(`/orgs/${a.orgId}`)}>
                    <div className="flex items-center gap-3.5 px-4 py-3.5">
                      <OrgLogo org={org} size={36} />
                      <div className="min-w-0 flex-1">
                        <div className="text-[11.5px] font-medium text-ink-3">{org.name}</div>
                        <div className="mt-px text-[14.5px] font-medium text-ink-1">{a.name}</div>
                      </div>
                      <div className="text-right">
                        <Badge tone={closingSoon ? 'red' : 'neutral'} icon="clock">
                          Due {fmtDate(a.deadline)} · {daysLeft}d
                        </Badge>
                        <div className="mt-1.5 text-[11.5px] text-ink-3">
                          {a.submissions} applied · {a.capacity} spots
                        </div>
                      </div>
                      <Icon name="chev_r" size={16} style={{ color: 'var(--ink-3)' }} />
                    </div>
                  </Card>
                )
              })}
            </div>
          </section>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-7">
          <section>
            <SectionHeader title="Recent updates" />
            <div className="flex flex-col gap-2.5">
              {recent.map((a) => {
                const org = orgOf(a.orgId)
                return (
                  <Card key={a.id} hoverable onClick={() => router.push(`/orgs/${a.orgId}`)}>
                    <div className="mb-2 flex items-center gap-2.5">
                      <OrgLogo org={org} size={22} radius={5} />
                      <div className="text-[12.5px] font-medium text-ink-2">{org.name}</div>
                      <span className="text-[11.5px] text-ink-3">·</span>
                      <span className="text-[11.5px] text-ink-3">{relTime(a.posted)}</span>
                      {a.urgent && (
                        <span className="ml-auto">
                          <Badge tone="red" icon="flag">
                            Urgent
                          </Badge>
                        </span>
                      )}
                    </div>
                    <div className="text-[14.5px] font-medium text-ink-1">{a.title}</div>
                    <p className="mt-1.5 line-clamp-2 text-[13px] leading-normal text-ink-2">{a.body}</p>
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
              {followed.map((o, i) => (
                <div
                  key={o.id}
                  onClick={() => router.push(`/orgs/${o.id}`)}
                  className={`flex cursor-pointer items-center gap-3 px-3.5 py-2.5 hover:bg-bg-2 ${
                    i === 0 ? '' : 'border-t border-border'
                  }`}
                >
                  <OrgLogo org={o} size={28} radius={6} />
                  <div className="min-w-0 flex-1">
                    <div className="text-[13.5px] font-medium text-ink-1">{o.name}</div>
                    <div className="text-[11.5px] text-ink-3">
                      {o.id === ME.adminOf ? 'Admin' : ME.roles[o.id] === 'member' ? 'Member' : 'Follower'}
                    </div>
                  </div>
                  <Icon name="chev_r" size={14} style={{ color: 'var(--ink-3)' }} />
                </div>
              ))}
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}
