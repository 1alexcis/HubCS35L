'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser } from '@/lib/hooks/useUser'
import { useMemberships } from '@/lib/hooks/useMemberships'
import { Avatar } from '@/components/ui/avatar'
import { OrgLogo } from '@/components/ui/org-logo'
import { Icon, type IconName } from '@/components/ui/icon'

const NAV = [
  { href: '/dashboard', icon: 'home' as IconName, label: 'Dashboard' },
  { href: '/discover', icon: 'compass' as IconName, label: 'Discover' },
]

export function Sidebar() {
  const path = usePathname()
  const { user, loading: userLoading } = useUser()
  const { memberships, loading: membLoading } = useMemberships()

  if (userLoading || membLoading) return null

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
    : (user?.email ?? '?')[0].toUpperCase()

  return (
    <aside
      className="flex flex-col border-r border-border bg-bg-1 h-screen sticky top-0"
      style={{ width: 232 }}
    >
      <div className="px-5 h-14 flex items-center border-b border-border flex-shrink-0">
        <span className="font-serif font-semibold text-[15px] tracking-tight text-ink-1">ClubHub</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-0.5">
        {NAV.map(({ href, icon, label }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
              path === href ? 'bg-accent/10 text-accent font-medium' : 'text-ink-2 hover:bg-bg-2 hover:text-ink-1'
            }`}
          >
            <Icon name={icon} size={15} />
            {label}
          </Link>
        ))}

        {memberships.length > 0 && (
          <>
            <p className="px-3 pt-4 pb-1 text-[11px] font-medium text-ink-3 uppercase tracking-wider">
              My Orgs
            </p>
            {memberships.map(m => {
              const href = `/orgs/${m.org_id}`
              const org = m.organizations
              return (
                <Link
                  key={m.id}
                  href={href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                    path.startsWith(href) ? 'bg-accent/10 text-accent font-medium' : 'text-ink-2 hover:bg-bg-2 hover:text-ink-1'
                  }`}
                >
                  <OrgLogo
                    org={{ color: org.avatar_color ?? '#4F46E5', logo: org.name.slice(0, 2).toUpperCase() }}
                    size={20}
                    radius={4}
                  />
                  <span className="truncate">{org.name}</span>
                  {memberships.find(mb => mb.org_id === m.org_id)?.role === 'admin' && (
                    <span className="ml-auto text-[10px] text-ink-3">Admin</span>
                  )}
                </Link>
              )
            })}
          </>
        )}
      </nav>

      <div className="border-t border-border px-4 py-3 flex items-center gap-2.5 flex-shrink-0">
        <Avatar initials={initials} size={28} />
        <span className="text-xs text-ink-2 truncate">{user?.email ?? ''}</span>
      </div>
    </aside>
  )
}
