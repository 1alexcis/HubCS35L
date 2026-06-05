/* Full E2E test for following and unfollowing an org */
import { test, expect } from '@playwright/test'

// Tests that a user can follow and unfollow an org and see the button state change.

const FOLLOW_ORG = '10000000-0000-0000-0000-000000000006' // Bruin AI (test user is not a member)

test('user can follow and unfollow an org', async ({ page }) => {
  await page.goto(`/orgs/${FOLLOW_ORG}`)

  // Starts as a non-member, so a plain "Follow" button is shown.
  const follow = page.getByRole('button', { name: 'Follow', exact: true })
  await expect(follow).toBeVisible()

  // Following writes a membership; the button reflects the new follower role.
  await follow.click()
  const following = page.getByRole('button', { name: 'Following' })
  await expect(following).toBeVisible()

  // Unfollowing removes the membership again, returning to the original state.
  await following.click()
  await expect(page.getByRole('button', { name: 'Follow', exact: true })).toBeVisible()
})
