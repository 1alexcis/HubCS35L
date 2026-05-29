'use client'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { ORGS, ME } from '@/lib/data'
import type { Org, Visibility } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge, VisibilityChip } from '@/components/ui/badge'
import { OrgLogo } from '@/components/ui/org-logo'
import { Icon, type IconName } from '@/components/ui/icon'

type Composer = 'event' | 'announcement' | 'applications' | 'settings'
type EventDraft = {
  title: string
  date: string
  time: string
  location: string
  description: string
  visibility: Visibility
}
type AnnDraft = { title: string; body: string; visibility: Visibility; urgent: boolean }

const NAV: { id: Composer; icon: IconName; label: string }[] = [
  { id: 'event', icon: 'calendar', label: 'Post event' },
  { id: 'announcement', icon: 'megaphone', label: 'Post announcement' },
  { id: 'applications', icon: 'doc', label: 'Review applications' },
  { id: 'settings', icon: 'settings', label: 'Org settings' },
]

const FIELD = 'w-full rounded-lg border border-border bg-bg-1 px-3 py-2.5 text-[13.5px] text-ink-1 outline-none'

export default function AdminPage() {
  const router = useRouter()
  const org = ORGS.find((o) => o.id === ME.adminOf)!
  const [composer, setComposer] = useState<Composer>('event')
  const [event, setEvent] = useState<EventDraft>({
    title: 'Industry Speaker: Engineering at Anthropic',
    date: '2026-05-17',
    time: '19:00',
    location: 'Boelter 3400',
    description: "An engineering manager from Anthropic on what it's like to build at the frontier. Q&A, then food.",
    visibility: 'public',
  })
  const [ann, setAnn] = useState<AnnDraft>({
    title: 'Hack Night moved to Boelter 5249',
    body: 'Room change for tomorrow — same time, just one floor up. Pizza count unchanged.',
    visibility: 'public',
    urgent: false,
  })

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
          Manage events, announcements, and recruitment for {org.name}.
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
          {composer === 'event' && <EventComposer org={org} event={event} setEvent={setEvent} />}
          {composer === 'announcement' && <AnnouncementComposer ann={ann} setAnn={setAnn} />}
          {composer === 'applications' && <Placeholder text="Review applications — coming next." />}
          {composer === 'settings' && <Placeholder text="Org settings — coming in Milestone 4." />}
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
  { id: 'members', icon: 'lock', label: 'Members', desc: 'Accepted members only' },
]

function VisibilityPicker({ value, onChange }: { value: Visibility; onChange: (v: Visibility) => void }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {VIS_OPTS.map((o) => {
        const on = value === o.id
        return (
          <button
            key={o.id}
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
}: {
  org: Org
  event: EventDraft
  setEvent: (e: EventDraft) => void
}) {
  return (
    <div className="grid grid-cols-[1.2fr_1fr] items-start gap-5">
      <Card>
        <div className="flex flex-col gap-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-3">New event</div>
            <h2 className="mt-1 font-serif font-medium text-ink-1" style={{ fontSize: 22, letterSpacing: '-0.015em' }}>
              Add to your org calendar
            </h2>
          </div>
          <Field label="Title">
            <input className={FIELD} value={event.title} onChange={(e) => setEvent({ ...event, title: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date">
              <input type="date" className={FIELD} value={event.date} onChange={(e) => setEvent({ ...event, date: e.target.value })} />
            </Field>
            <Field label="Time">
              <input type="time" className={FIELD} value={event.time} onChange={(e) => setEvent({ ...event, time: e.target.value })} />
            </Field>
          </div>
          <Field label="Location">
            <input className={FIELD} value={event.location} onChange={(e) => setEvent({ ...event, location: e.target.value })} />
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
          <div className="mt-1 flex justify-between">
            <Button variant="ghost">Save draft</Button>
            <div className="flex gap-2">
              <Button variant="secondary">Schedule</Button>
              <Button variant="primary" icon="check">
                Post event
              </Button>
            </div>
          </div>
        </div>
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
                <OrgLogo org={org} size={18} radius={4} />
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
          {event.visibility === 'followers' && `Visible to your ${org.followers.toLocaleString()} followers and members.`}
          {event.visibility === 'members' && `Visible to ${org.members} accepted members only.`}
        </div>
      </div>
    </div>
  )
}

function AnnouncementComposer({ ann, setAnn }: { ann: AnnDraft; setAnn: (a: AnnDraft) => void }) {
  return (
    <div className="grid grid-cols-[1.2fr_1fr] items-start gap-5">
      <Card>
        <div className="flex flex-col gap-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-3">New announcement</div>
            <h2 className="mt-1 font-serif font-medium text-ink-1" style={{ fontSize: 22, letterSpacing: '-0.015em' }}>
              Broadcast to your org
            </h2>
          </div>
          <Field label="Title">
            <input className={FIELD} value={ann.title} onChange={(e) => setAnn({ ...ann, title: e.target.value })} />
          </Field>
          <Field label="Body">
            <textarea
              rows={6}
              className={`${FIELD} resize-y leading-relaxed`}
              value={ann.body}
              onChange={(e) => setAnn({ ...ann, body: e.target.value })}
            />
          </Field>
          <Field label="Audience">
            <VisibilityPicker value={ann.visibility} onChange={(v) => setAnn({ ...ann, visibility: v })} />
          </Field>
          <label
            className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2.5"
            style={{
              border: `1.5px solid ${ann.urgent ? '#a83a3a' : 'var(--border)'}`,
              background: ann.urgent ? 'rgba(168,58,58,0.06)' : 'var(--bg-1)',
            }}
          >
            <input
              type="checkbox"
              checked={ann.urgent}
              onChange={(e) => setAnn({ ...ann, urgent: e.target.checked })}
              style={{ accentColor: '#a83a3a' }}
            />
            <div className="flex-1">
              <div className="text-[13px] font-medium text-ink-1">Mark urgent</div>
              <div className="text-[11.5px] text-ink-3">Sends a push notification to people who opted in. Use sparingly.</div>
            </div>
            <Icon name="flag" size={14} style={{ color: ann.urgent ? '#a83a3a' : 'var(--ink-3)' }} />
          </label>
          <div className="flex justify-end gap-2">
            <Button variant="ghost">Save draft</Button>
            <Button variant="primary" icon="megaphone">
              Post announcement
            </Button>
          </div>
        </div>
      </Card>

      <div className="sticky top-6">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-3">Live preview</div>
        <Card>
          <div className="mb-2 flex items-center gap-2">
            {ann.urgent && (
              <Badge tone="red" icon="flag">
                Urgent
              </Badge>
            )}
            <VisibilityChip visibility={ann.visibility} />
          </div>
          <div className="text-base font-medium text-ink-1">{ann.title || 'Untitled announcement'}</div>
          <p className="mt-2 text-[13.5px] leading-relaxed text-ink-2">{ann.body || 'No body yet.'}</p>
        </Card>
      </div>
    </div>
  )
}

function Placeholder({ text }: { text: string }) {
  return (
    <Card>
      <div className="px-4 py-8 text-center text-sm text-ink-3">{text}</div>
    </Card>
  )
}
