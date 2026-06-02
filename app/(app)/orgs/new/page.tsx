'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { OrgLogo } from '@/components/ui/org-logo'

const FIELD = 'w-full rounded-lg border border-border bg-bg-1 px-3 py-2.5 text-[13.5px] text-ink-1 outline-none'
const COLORS = ['#1f4ea8', '#a04a1f', '#7a4ad6', '#0f6f5c', '#a83a3a', '#6b5a2c']

// "Bruin Robotics" -> "BR", "ACM" -> "AC"
function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return name.trim().slice(0, 2).toUpperCase()
}

export default function NewOrgPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState(COLORS[0])
  const [notice, setNotice] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !description.trim()) return
    setNotice('Organization creation will be saved once Supabase writes are connected.')
  }

  return (
    <div className="mx-auto max-w-[640px]">
      <div className="mb-6">
        <h1 className="font-serif font-medium text-ink-1" style={{ fontSize: 30, letterSpacing: '-0.02em' }}>
          Create an organization
        </h1>
        <div className="mt-1 text-[13.5px] text-ink-3">
          Set up your club&apos;s page. You&apos;ll be its admin.
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <OrgLogo org={{ color, logo: initials(name) || '?' }} size={44} radius={10} />
            <div className="text-[13px] text-ink-3">Logo preview</div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-2">Name</label>
            <input className={FIELD} value={name} onChange={(e) => setName(e.target.value)} placeholder="Bruin Robotics" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-2">Category</label>
            <input className={FIELD} value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Technology" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-2">Description</label>
            <textarea
              rows={4}
              className={`${FIELD} resize-y leading-normal`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does your club do?"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-ink-2">Color</label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="h-7 w-7 rounded-full"
                  style={{ background: c, outline: color === c ? '2px solid var(--ink-1)' : 'none', outlineOffset: 2 }}
                />
              ))}
            </div>
          </div>

          <div className="mt-1 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => router.push('/discover')}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" icon="check" disabled={!name.trim() || !description.trim()}>
              Create org
            </Button>
          </div>
          {notice && <div className="text-[12.5px] text-ink-3">{notice}</div>}
        </form>
      </Card>
    </div>
  )
}
