# ClubHub

ClubHub is a Next.js app backed by Supabase for UCLA student organizations. The app uses Supabase Auth for login and Supabase Postgres for organizations, memberships, events, and RSVPs.

## Local Development

Install dependencies:

```bash
npm install
```

Create `.env.local` with the Supabase values:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Run the app locally:

```bash
npm run dev
```

## E2E Testing

The Playwright tests live in `test_suites/` and run with:

```bash
npx playwright install
npm run test:e2e
```

Authenticated E2E tests use a dedicated Supabase fixture user instead of magic-link login. This avoids email rate limits and makes tests repeatable.

Test user:

```txt
Email: clubhub-test@g.ucla.edu
User ID: b99e251d-0b9d-4fc0-aaf0-68d49c621df3
```

Fixture orgs:

```txt
Admin org: ClubHub E2E Admin Org
Admin org ID: 82a189ff-5d72-4a8e-8f50-baf71f4ac62a

Follower org: ClubHub E2E Follower Org
Follower org ID: 11111111-1111-4111-8111-111111111111

Guest org: ClubHub E2E Guest Org
Guest org ID: 22222222-2222-4222-8222-222222222222
```

To run authenticated E2E tests, start Playwright with the test user enabled:

```bash
NEXT_PUBLIC_UNSAFE_E2E_USER_ID=b99e251d-0b9d-4fc0-aaf0-68d49c621df3 \
NEXT_PUBLIC_E2E_USER_EMAIL=clubhub-test@g.ucla.edu \
NEXT_PUBLIC_E2E_ADMIN_ORG_ID=82a189ff-5d72-4a8e-8f50-baf71f4ac62a \
NEXT_PUBLIC_E2E_FOLLOWER_ORG_ID=11111111-1111-4111-8111-111111111111 \
NEXT_PUBLIC_E2E_GUEST_ORG_ID=22222222-2222-4222-8222-222222222222 \
npm run test:e2e
```

`NEXT_PUBLIC_UNSAFE_E2E_USER_ID` is intentionally named as unsafe because it bypasses normal Supabase Auth for local tests. Do not set it outside local E2E testing.
