import { expect, type Page } from '@playwright/test';

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

	await expect(page).toHaveURL(/my/);
}
