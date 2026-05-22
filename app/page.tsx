'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from '@/components/ui/icon'
import { Button } from '@/components/ui/button'

function isUCLAEmail(email: string) {
  return email.endsWith('@ucla.edu') || email.endsWith('@g.ucla.edu')
}

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  function handleContinue(e: React.FormEvent) {
    e.preventDefault()
    if (!isUCLAEmail(email)) {
      setError('Must be a UCLA email (@g.ucla.edu or @ucla.edu)')
      return
    }
    router.push('/onboarding')
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

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-ink-3">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <Button
            variant="secondary"
            size="md"
            full
            onClick={() => router.push('/onboarding')}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden style={{ flexShrink: 0 }}>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </Button>
        </div>
      </div>

    </div>
  )
}
