'use client'
/* Sign in page: email magic link or Google OAuth, restricted to UCLA addresses */
import { useState } from 'react'
import { Icon } from '@/components/ui/icon'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

function isUCLAEmail(email: string) {
  return email.endsWith('@ucla.edu') || email.endsWith('@g.ucla.edu')
}

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  async function handleContinue(e: React.FormEvent) {
    e.preventDefault()
    if (!isUCLAEmail(email)) {
      setError('Must be a UCLA email (@g.ucla.edu or @ucla.edu)')
      return
    }
    const supabase = createClient()
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + '/auth/callback' },
    })
    if (err) { setError(err.message); return }
    setSent(true)
  }

  return (
    <div className="grid min-h-screen" style={{ gridTemplateColumns: '1fr 1fr' }}>

      <div
        className="relative flex flex-col justify-between p-12 overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #163680 0%, #1f4ea8 55%, #2a5dc8 100%)' }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative z-10 flex flex-col">
          <div className="flex items-center gap-2.5 mb-20">
            <div
              className="w-8 h-8 rounded-lg grid place-items-center"
              style={{ background: 'rgba(255,255,255,0.18)' }}
            >
              <Icon name="sparkle" size={15} style={{ color: '#fff' }} />
            </div>
            <span className="font-serif font-semibold text-white text-[17px] tracking-tight">ClubHub</span>
          </div>

          <h1 className="font-serif text-[2.6rem] font-semibold text-white leading-[1.15] mb-5">
            Every club you care about.<br />One place.
          </h1>
          <p className="text-white/65 text-[15px] leading-relaxed mb-10 max-w-sm">
            Discover orgs, track events, get updates, and apply — all in one dashboard built for UCLA students.
          </p>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full grid place-items-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.2)' }}>
                <Icon name="check" size={11} style={{ color: '#fff' }} />
              </div>
              <span className="text-white/75 text-sm">Browse and follow 200+ student organizations</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full grid place-items-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.2)' }}>
                <Icon name="check" size={11} style={{ color: '#fff' }} />
              </div>
              <span className="text-white/75 text-sm">Never miss an event, deadline, or announcement</span>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-white/35 text-xs">© 2026 ClubHub · UCLA</p>
      </div>

      <div className="flex items-center justify-center p-12 bg-bg-0">
        <div className="w-full max-w-[340px]">
          <h2 className="font-serif text-[1.6rem] font-semibold text-ink-1 mb-1">Sign in</h2>
          <p className="text-sm text-ink-3 mb-8">Use your UCLA email address to get started.</p>

          {sent ? (
            <div className="rounded-lg border border-border bg-bg-1 px-4 py-5 text-sm text-ink-2">
              Check your email — we sent a link to <span className="font-medium text-ink-1">{email}</span>.
            </div>
          ) : (
            <form onSubmit={handleContinue} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs font-medium text-ink-2">
                  School email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError('') }}
                  placeholder="you@g.ucla.edu"
                  className="h-9 px-3 rounded-lg border border-border bg-bg-1 text-sm text-ink-1 placeholder:text-ink-3 outline-none focus:ring-2 focus:border-accent transition-colors"
                />
                {error && (
                  <p className="text-xs" style={{ color: '#a83a3a' }}>{error}</p>
                )}
              </div>

              <Button variant="primary" size="md" full type="submit">
                Continue
              </Button>
            </form>
          )}

        </div>
      </div>

    </div>
  )
}
