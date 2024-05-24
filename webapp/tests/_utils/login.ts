import { type Browser, expect, type Page } from '@playwright/test';

export async function login(page: Page, email: string, password: string) {
	await page.goto('/login');

	const emailField = page.locator('#email');
	const passwordField = page.locator('#password');
	await expect(emailField).toBeVisible();
	await expect(passwordField).toBeVisible();

	await emailField.fill(email);
	await passwordField.fill(password);

	const submitButton = page.locator('#submit');
	await expect(submitButton).toBeVisible();
	await submitButton.click();

	await expect(page).toHaveURL(/keypairoom/);
	if (/keypairoom\/regenerate/.test(page.url())) {
		await page.getByRole('link', { name: 'Forgot the "seed"? Regenerate it' }).click();
	}

	const o = page.locator('input[name="questions\\.whereParentsMet"]');
	await expect(o).toBeVisible();

	await page.locator('input[name="questions\\.whereParentsMet"]').fill('p');
	await page.locator('input[name="questions\\.nameFirstPet"]').fill('p');
	await page.locator('input[name="questions\\.whereHomeTown"]').fill('p');
	await page.locator('input[name="questions\\.nameFirstTeacher"]').fill('p');
	await page.locator('input[name="questions\\.nameMotherMaid"]').fill('p');

	await page.getByRole('button', { name: 'Generate keys' }).click();
	await page.getByRole('link', { name: 'Go to Dashboard' }).click();

	await expect(page).toHaveURL(/my/);
}

export async function userLogin(browser: Browser, index: 'A' | 'B' | 'C') {
	const email = process.env[`TEST_USER_${index}_MAIL`];
	const password = process.env[`TEST_USER_${index}_PASS`];

	if (!email || !password) throw new Error(`No test user ${index} email or password set in ENV`);

	const context = await browser.newContext();
	const page = await context.newPage();

	await login(page, email, password);

	return page;
}

export function randomId() {
	return (Math.random() + 1).toString(36).substring(7);
}
