import { test, expect } from '@playwright/test'

// E2E tests for the sign-in page.
// Each test goes to the page, does something, then checks the result.
// To test a different page, copy a test and change the path/locators/text.

test('shows an error for a non-UCLA email', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('School email').fill('test@gmail.com')
  await page.getByRole('button', { name: 'Continue', exact: true }).click()

  const error = page.getByText(/Must be a UCLA email/i)
  await expect(error).toBeVisible()
  await expect(error).toContainText('UCLA email')
})

test('shows an error when the email is empty', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  await expect(page.getByText(/Must be a UCLA email/i)).toBeVisible()
})

test('accepts a valid UCLA email', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('School email').fill('joe@g.ucla.edu')
  await page.getByRole('button', { name: 'Continue', exact: true }).click()
  // valid email passes the check, so the error should not show up
  await expect(page.getByText(/Must be a UCLA email/i)).toHaveCount(0)
})
