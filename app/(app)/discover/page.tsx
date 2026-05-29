'use client'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ORGS, ME } from '@/lib/data'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { OrgLogo } from '@/components/ui/org-logo'
import { Icon } from '@/components/ui/icon'

export default function DiscoverPage() {
  const router = useRouter()
  const [q, setQ] = useState('')
  const filtered = useMemo(
    () =>
      ORGS.filter((o) => `${o.name} ${o.tagline} ${o.category}`.toLowerCase().includes(q.toLowerCase())),
    [q],
  )

  return (
    <div className="mx-auto max-w-[1240px]">
      <div className="mb-6">
        <h1 className="font-serif font-medium text-ink-1" style={{ fontSize: 32, letterSpacing: '-0.02em' }}>
          Discover orgs
        </h1>
        <p className="mt-1.5 text-sm text-ink-3">{ORGS.length} organizations · pre-professional and academic</p>
      </div>

      <div className="mb-5 flex items-center gap-2.5 rounded-[10px] border border-border bg-bg-1 px-3.5 py-2.5">
        <Icon name="search" size={16} style={{ color: 'var(--ink-3)' }} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, category, or keyword"
          className="flex-1 bg-transparent text-sm text-ink-1 outline-none"
        />
        <div className="flex gap-1.5">
          <Badge tone="blue">Pre-professional</Badge>
          <Badge>Academic</Badge>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3.5">
        {filtered.map((o) => {
          const role = ME.roles[o.id]
          const following = ['follower', 'applicant', 'member'].includes(role) || o.id === ME.adminOf
          return (
            <Card key={o.id} padding={0} hoverable onClick={() => router.push(`/orgs/${o.id}`)}>
              <div
                className="h-[60px] rounded-t-xl"
                style={{
                  background: `linear-gradient(135deg, ${o.color} 0%, color-mix(in oklch, ${o.color} 60%, #1a1a40) 100%)`,
                }}
              />
              <div className="-mt-[22px] p-4">
                <OrgLogo org={o} size={44} radius={10} />
                <div className="mt-2.5 text-[15px] font-medium text-ink-1">{o.name}</div>
                <div className="mt-0.5 text-[11.5px] text-ink-3">{o.category}</div>
                <div className="mt-2.5 min-h-9 text-[13px] leading-normal text-ink-2">{o.tagline}</div>
                <div className="mt-3.5 flex items-center justify-between">
                  <div className="text-[11.5px] text-ink-3">{o.followers.toLocaleString()} followers</div>
                  <Button
                    variant={following ? 'soft' : 'secondary'}
                    size="sm"
                    icon={following ? 'check' : 'plus'}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {following ? 'Following' : 'Follow'}
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
