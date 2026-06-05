import { test, expect } from '@playwright/test'

// These run as the E2E test user (set NEXT_PUBLIC_UNSAFE_E2E_USER_ID in .env.local).
// The test user is an admin of the admin org, a follower of the follower org,
// and not a member of the guest org — so each org page shows different buttons.

const ADMIN_ORG = process.env.NEXT_PUBLIC_E2E_ADMIN_ORG_ID!
const FOLLOWER_ORG = process.env.NEXT_PUBLIC_E2E_FOLLOWER_ORG_ID!
const GUEST_ORG = process.env.NEXT_PUBLIC_E2E_GUEST_ORG_ID!

test('admin sees the admin controls on their org', async ({ page }) => {
  await page.goto(`/orgs/${ADMIN_ORG}`)
  await expect(page.getByRole('button', { name: 'Post event' })).toBeVisible()
})

test('follower sees the following button', async ({ page }) => {
  await page.goto(`/orgs/${FOLLOWER_ORG}`)
  await expect(page.getByRole('button', { name: 'Following' })).toBeVisible()
})

test('guest sees a follow button and no admin controls', async ({ page }) => {
  await page.goto(`/orgs/${GUEST_ORG}`)
  await expect(page.getByRole('button', { name: 'Follow', exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Admin panel' })).toHaveCount(0)
})
