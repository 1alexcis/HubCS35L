# ClubHub — Request Flow (UML Sequence Diagrams)

ClubHub is a **Next.js (App Router) client + Supabase backend-as-a-service** app.
Nearly all data access is **direct from the browser to Supabase** via the Supabase
JS client SDK — there is no custom API/server layer. The one server-side route is
the OAuth/magic-link callback (`app/auth/callback/route.ts`).

The layers shown below:

| Actor / Participant | What it is | Code |
|---|---|---|
| **User** | Person in the browser | — |
| **Page** (`'use client'`) | React page component | `app/(app)/**/page.tsx` |
| **Hook / Context** | Data-loading hooks & shared state | `lib/hooks/*`, `lib/context/memberships.tsx` |
| **db.ts** | Thin data-access wrappers | `lib/db.ts` |
| **Supabase client** | Browser SDK (`@supabase/ssr`) | `lib/supabase/client.ts` |
| **Supabase backend** | Postgres + Auth + Row-Level Security | hosted |
| **Callback route** | Server route handler | `app/auth/callback/route.ts` |

> Diagrams use [Mermaid](https://mermaid.js.org/), which renders natively on GitHub.

---

## 1. Authentication (magic link / OTP)

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Page as Sign-In Page<br/>(app/page.tsx)
    participant SB as Supabase Client<br/>(browser SDK)
    participant Auth as Supabase Auth
    participant Email as Email Inbox
    participant CB as Callback Route<br/>(auth/callback/route.ts)
    participant DB as Supabase DB (Postgres)

    User->>Page: enter UCLA email + Continue
    Page->>SB: auth.signInWithOtp({ email, emailRedirectTo: /auth/callback })
    SB->>Auth: request magic link
    Auth-->>Email: send link with one-time code
    SB-->>Page: { success } (check your email)
    Page-->>User: "Check your inbox"

    User->>Email: click magic link
    Email->>CB: GET /auth/callback?code=...
    Note over CB: runs on the server
    CB->>Auth: exchangeCodeForSession(code)
    Auth-->>CB: session + Set-Cookie (HTTP-only)
    CB->>Auth: getUser()
    Auth-->>CB: { user }
    CB->>DB: profiles.upsert({ id, email, ... })
    DB-->>CB: ok
    CB-->>User: 302 redirect → /dashboard (cookie set)
```

Auth tokens are stored in **HTTP-only cookies** managed by `@supabase/ssr`, so
every subsequent client query automatically carries the session.

---

## 2. Read flow — Discover page (list all orgs + follow)

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Page as Discover Page<br/>(discover/page.tsx)
    participant Hook as useOrgs() / useMemberships()
    participant DB as lib/db.ts
    participant SB as Supabase Client
    participant API as Supabase backend<br/>(Postgres + RLS)

    User->>Page: navigate to /discover
    activate Page
    Page->>Hook: mount → useEffect
    Hook->>DB: listOrganizations()
    DB->>SB: from('organizations').select('*').order('name')
    SB->>API: HTTPS query (with auth cookie)
    API-->>SB: Organization[]
    SB-->>DB: data
    DB-->>Hook: orgs
    Hook-->>Page: { orgs, loading=false }
    Page-->>User: render org cards
    deactivate Page

    User->>Page: click "Follow"
    Page->>DB: followOrg(orgId)
    DB->>SB: getCurrentUserId() → auth.getUser()
    SB->>API: resolve user
    API-->>SB: { user.id }
    DB->>SB: memberships.insert({ user_id, org_id, role:'follower' })
    SB->>API: INSERT (RLS enforced)
    API-->>SB: ok
    SB-->>DB: ok
    Page->>Hook: refetch()
    Hook->>DB: listMyMemberships()
    DB->>SB: memberships query
    SB->>API: query
    API-->>SB: memberships[]
    SB-->>Hook: data
    Hook-->>Page: re-render → "Following"
    Page-->>User: updated button + sidebar
```

---

## 3. Read flow — View org with events & RSVP counts

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Page as Org Page<br/>(orgs/[orgId]/page.tsx)
    participant Ctx as useMemberships() (context)
    participant DB as lib/db.ts
    participant SB as Supabase Client
    participant API as Supabase backend

    User->>Page: navigate to /orgs/{orgId}
    activate Page
    Page->>DB: getOrgWithEvents(orgId)
    DB->>SB: organizations.select('*, events(*)').eq('id', orgId).single()
    SB->>API: HTTPS query
    API-->>SB: { org, events[] }
    SB-->>Page: org + events

    Page->>DB: countRsvpsForEvents(eventIds)
    DB->>SB: rsvps.select('event_id').in('event_id', eventIds)
    SB->>API: query
    API-->>SB: rows
    SB-->>Page: counts (aggregated client-side)

    Page->>Ctx: getRole(orgId)
    Note over Page,Ctx: memberships already cached<br/>in MembershipsProvider
    Ctx-->>Page: viewerRole

    Note over Page: canViewEvent(visibility, viewerRole)<br/>filters which events are shown
    Page-->>User: render events (filtered) + RSVP counts
    deactivate Page
```

`MembershipsProvider` (`lib/context/memberships.tsx`) wraps `app/(app)/layout.tsx`
and loads the user's memberships **once**, so pages read roles from context
instead of re-querying.

---

## 4. Write flow — Create org / Post event (admin)

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Page as New Org / Admin Page<br/>(orgs/new, admin/page.tsx)
    participant DB as lib/db.ts
    participant SB as Supabase Client
    participant API as Supabase backend

    rect rgb(240,245,255)
    Note over User,API: Create organization
    User->>Page: submit { name, description }
    Page->>DB: createOrgAsAdmin(name, description)
    DB->>SB: getCurrentUserId()
    SB->>API: auth.getUser()
    API-->>SB: { user.id }
    DB->>SB: organizations.insert({ name, description }).select('id').single()
    SB->>API: INSERT (RLS)
    API-->>SB: { org.id }
    DB->>SB: memberships.insert({ user_id, org_id, role:'admin' })
    SB->>API: INSERT (RLS)
    API-->>SB: ok
    DB-->>Page: orgId
    Page-->>User: redirect → /orgs/{orgId}
    end

    rect rgb(245,255,240)
    Note over User,API: Post event (admin only)
    User->>Page: submit event form
    Page->>DB: createEvent({ orgId, title, startTime, location, visibility, ... })
    DB->>SB: events.insert({ org_id, title, start_time, visibility, ... })
    SB->>API: INSERT (RLS checks admin role)
    API-->>SB: ok
    DB-->>Page: success
    Page-->>User: redirect → /orgs/{orgId}
    end
```

---

## 5. Write flow — RSVP toggle (optimistic update)

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Page as Event card / Dashboard
    participant DB as lib/db.ts
    participant SB as Supabase Client
    participant API as Supabase backend
    participant Hook as useRsvps()

    User->>Page: click RSVP
    Note over Page: optimistic local state bump
    Page-->>User: button → "Going" (immediate)

    alt not yet RSVPed
        Page->>DB: addRsvp(eventId)
        DB->>SB: rsvps.insert({ user_id, event_id })
    else already RSVPed
        Page->>DB: removeRsvp(eventId)
        DB->>SB: rsvps.delete().eq(user_id).eq(event_id)
    end
    SB->>API: INSERT / DELETE (RLS)
    API-->>SB: ok
    SB-->>DB: ok

    Page->>Hook: refetch()
    Hook->>DB: listMyRsvps()
    DB->>SB: rsvps.select('*').eq('user_id', userId)
    SB->>API: query
    API-->>SB: rsvps[]
    SB-->>Hook: data
    Hook-->>Page: reconciled state
```

---

## Key architectural notes

- **No custom backend / API routes for data.** The browser talks to Supabase
  directly; authorization is enforced server-side by **Postgres Row-Level
  Security (RLS)** policies, not by an app server.
- **`lib/db.ts`** is the single data-access boundary — every query goes through it.
- **Hooks + context** (`useOrgs`, `useDashboard`, `useRsvps`, `MembershipsProvider`)
  own loading state and the `refetch()` pattern used after writes.
- **Auth** is the only server-side request path: the `/auth/callback` route
  exchanges the code for a session cookie and upserts the user's profile.
