'use client'
import Link from 'next/link'
import { Icon } from '@/components/ui/icon'
import { Button } from '@/components/ui/button'
import { ANNOUNCEMENTS } from '@/lib/data'

const notifCount = ANNOUNCEMENTS.length

export function TopBar() {
  return (
    <header className="sticky top-0 z-10 bg-bg-1 border-b border-border flex items-center gap-3 px-6 h-14 flex-shrink-0">
      <div className="flex items-center gap-2 bg-bg-2 border border-border rounded-lg px-3 h-8 text-sm text-ink-3 w-64 cursor-text select-none">
        <Icon name="search" size={13} />
        <span className="flex-1">Search</span>
        <kbd className="text-[11px] border border-border rounded px-1 py-px font-mono leading-none">⌘K</kbd>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Link href="/updates" className="relative">
          <Button variant="ghost" size="sm" icon="bell">
            Updates
          </Button>
          {notifCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full bg-accent text-white text-[10px] font-semibold grid place-items-center px-1 leading-none">
              {notifCount}
            </span>
          )}
        </Link>
        <Button variant="primary" size="sm" icon="plus">
          Post
        </Button>
      </div>
    </header>
  )
}
