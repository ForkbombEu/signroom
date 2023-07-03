import { expect, test as setup } from '@playwright/test';
import dotenv from 'dotenv';

export const authFile = 'playwright/.auth/user.json';

dotenv.config();

setup('authenticate', async ({ page }) => {
	if (!process.env.TEST_USER_EMAIL || !process.env.TEST_USER_PASSWORD)
		throw new Error('No test user email or password set in ENV');
	await page.goto('/');

	const loginButton = page.locator('#btn-login');
	await expect(loginButton).toBeVisible();
	await loginButton.click();
	await expect(page).toHaveURL(/login/);

	const emailField = page.locator('#email');
	const passwordField = page.locator('#password');
	await expect(emailField).toBeVisible();
	await expect(passwordField).toBeVisible();

	await emailField.fill(process.env.TEST_USER_EMAIL);
	await passwordField.fill(process.env.TEST_USER_PASSWORD);

	const submitButton = page.locator('#submit');
	await expect(submitButton).toBeVisible();
	await submitButton.click();

	await expect(page).toHaveURL(/my/);
	await page.context().storageState({ path: authFile });
});
