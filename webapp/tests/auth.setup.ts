import { expect, test as setup } from '@playwright/test';
import { config } from 'dotenv';
import { login } from '@utils/login';

export const authFile = 'playwright/.auth/user.json';

config();

setup('authenticate', async ({ page }) => {
	if (!process.env.TEST_USER_A_MAIL || !process.env.TEST_USER_A_PASS)
		throw new Error('No test user email or password set in ENV');
	await page.goto('/');

	const loginButton = page.locator('#btn-login');
	await expect(loginButton).toBeVisible();
	await loginButton.click();
	await expect(page).toHaveURL(/login/);

	await login(page, process.env.TEST_USER_A_MAIL, process.env.TEST_USER_A_PASS);
	await page.context().storageState({ path: authFile });
});
