/* Full E2E test for the event posting flow */
import { test, expect } from '@playwright/test'

// Tests that an admin user can post a unique event and see it on the org page.

const ADMIN_ORG = process.env.NEXT_PUBLIC_E2E_ADMIN_ORG_ID!

test('admin can post an event and see it on the org page', async ({ page }) => {
  const title = `E2E Test Event ${Date.now()}`

  await page.goto(`/admin?orgId=${ADMIN_ORG}`)

  // Fill in the Title and Location fields (other fields use defaults).
  const form = page.locator('form')
  const textInputs = form.locator('input:not([type="date"]):not([type="time"])')
  await textInputs.nth(0).fill(title)
  await textInputs.nth(1).fill('Kerckhoff Hall')
  await form.getByRole('button', { name: 'Post event' }).click()

  // Posting redirects to the org page, where the new event should be listed.
  await expect(page).toHaveURL(new RegExp(ADMIN_ORG))
  await expect(page.getByText(title)).toBeVisible()
})
