'use client'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getCurrentUserId } from '@/lib/supabase/current-user'
import { useOrgs } from '@/lib/hooks/useOrgs'
import { useMemberships } from '@/lib/hooks/useMemberships'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { OrgLogo } from '@/components/ui/org-logo'
import { Icon } from '@/components/ui/icon'

export default function DiscoverPage() {
  const router = useRouter()
  const { orgs, loading } = useOrgs()
  const { memberships, refetch } = useMemberships()
  const [q, setQ] = useState('')

  async function handleFollow(e: React.MouseEvent, orgId: string, isFollower: boolean) {
    e.stopPropagation()
    const supabase = createClient()
    // Use the E2E test user when configured; otherwise use normal Supabase auth.
    const userId = await getCurrentUserId(supabase)
    if (!userId) return
    if (isFollower) {
      await supabase.from('memberships').delete().eq('user_id', userId).eq('org_id', orgId)
    } else {
      await supabase.from('memberships').insert({ user_id: userId, org_id: orgId, role: 'follower' })
    }
    refetch()
  }

  const filtered = useMemo(
    () => orgs.filter((o) => `${o.name} ${o.description} ${o.category}`.toLowerCase().includes(q.toLowerCase())),
    [q, orgs],
  )

  if (loading) return <div className="p-8 text-sm text-ink-3">Loading...</div>

  return (
    <div className="mx-auto max-w-[1240px]">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-serif font-medium text-ink-1" style={{ fontSize: 32, letterSpacing: '-0.02em' }}>
            Discover orgs
          </h1>
          <p className="mt-1.5 text-sm text-ink-3">{orgs.length} organizations · pre-professional and academic</p>
        </div>
        <Button variant="primary" icon="plus" onClick={() => router.push('/orgs/new')}>
          Create org
        </Button>
      </div>

      <div className="mb-5 flex items-center gap-2.5 rounded-[10px] border border-border bg-bg-1 px-3.5 py-2.5">
        <Icon name="search" size={16} style={{ color: 'var(--ink-3)' }} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, category, or keyword"
          className="flex-1 bg-transparent text-sm text-ink-1 outline-none"
        />
      </div>

      <div className="grid grid-cols-3 gap-3.5">
        {filtered.map((o) => {
          const role = memberships.find(m => m.org_id === o.id)?.role ?? null
          const isFollower = role != null
          const color = o.avatar_color ?? '#4F46E5'
          return (
            <Card key={o.id} padding={0} hoverable onClick={() => router.push(`/orgs/${o.id}`)}>
              <div
                className="h-[60px] rounded-t-xl"
                style={{
                  background: `linear-gradient(135deg, ${color} 0%, color-mix(in oklch, ${color} 60%, #1a1a40) 100%)`,
                }}
              />
              <div className="-mt-[22px] p-4">
                <OrgLogo org={{ color, logo: o.name.slice(0, 2).toUpperCase() }} size={44} radius={10} />
                <div className="mt-2.5 text-[15px] font-medium text-ink-1">{o.name}</div>
                <div className="mt-0.5 text-[11.5px] text-ink-3">{o.category}</div>
                <div className="mt-2.5 min-h-9 text-[13px] leading-normal text-ink-2">{o.description}</div>
                <div className="mt-3.5 flex items-center justify-between">
                  <div />
                  <Button
                    variant={isFollower ? 'soft' : 'secondary'}
                    size="sm"
                    icon={isFollower ? 'check' : 'plus'}
                    onClick={(e) => handleFollow(e, o.id, isFollower)}
                  >
                    {isFollower ? 'Following' : 'Follow'}
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
