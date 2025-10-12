import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Web Application Template/i)
  })

  test('should have navigation to login and register', async ({ page }) => {
    await page.goto('/')

    const loginLink = page.getByRole('link', { name: /login/i })
    const registerLink = page.getByRole('link', { name: /register/i })

    await expect(loginLink).toBeVisible()
    await expect(registerLink).toBeVisible()
  })

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /login/i }).click()
    await expect(page).toHaveURL(/\/login/)
  })

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /register/i }).click()
    await expect(page).toHaveURL(/\/register/)
  })
})
