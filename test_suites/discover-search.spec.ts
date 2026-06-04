import { test, expect } from '@playwright/test'

// Runs as the E2E test user (Discover is behind login).
// Checks the search box on the Discover page filters the list of orgs.
// We scope to the main content so we don't match the org names in the sidebar.

test('search filters the list to matching orgs', async ({ page }) => {
  await page.goto('/discover')
  const main = page.getByRole('main')
  await main.getByPlaceholder('Search by name, category, or keyword').fill('ClubHub E2E Admin')
  await expect(main.getByText('ClubHub E2E Admin Org')).toBeVisible()
  await expect(main.getByText('ClubHub E2E Guest Org')).toHaveCount(0)
})

test('search with no matches shows no orgs', async ({ page }) => {
  await page.goto('/discover')
  const main = page.getByRole('main')
  await main.getByPlaceholder('Search by name, category, or keyword').fill('zzz no org matches this')
  await expect(main.getByText('ClubHub E2E Admin Org')).toHaveCount(0)
})
