'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ME, ORGS } from '@/lib/data'
import { Avatar } from '@/components/ui/avatar'
import { OrgLogo } from '@/components/ui/org-logo'
import { Icon, type IconName } from '@/components/ui/icon'

const NAV = [
  { href: '/dashboard', icon: 'home' as IconName, label: 'Dashboard' },
  { href: '/discover', icon: 'compass' as IconName, label: 'Discover' },
]

const MY_ORGS = ORGS.filter(o => {
  const r = ME.roles[o.id]
  return r === 'admin' || r === 'follower'
})

export function Sidebar() {
  const path = usePathname()

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

        <p className="px-3 pt-4 pb-1 text-[11px] font-medium text-ink-3 uppercase tracking-wider">
          My Orgs
        </p>
        {MY_ORGS.map(org => {
          const href = `/orgs/${org.id}`
          return (
            <Link
              key={org.id}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                path.startsWith(href) ? 'bg-accent/10 text-accent font-medium' : 'text-ink-2 hover:bg-bg-2 hover:text-ink-1'
              }`}
            >
              <OrgLogo org={org} size={20} radius={4} />
              <span className="truncate">{org.short}</span>
              {ME.roles[org.id] === 'admin' && (
                <span className="ml-auto text-[10px] text-ink-3">Admin</span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border px-4 py-3 flex items-center gap-2.5 flex-shrink-0">
        <Avatar initials={ME.initials} size={28} />
        <span className="text-xs text-ink-2 truncate">{ME.email}</span>
      </div>
    </aside>
  )
}
