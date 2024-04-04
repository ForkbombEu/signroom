// @ts-check
import { test, expect } from '@playwright/test'
import fs from 'fs/promises'
import path from 'path'

/**
 *  A convenience method that handles gracefully cleaning up the test run.
 */
export const saveVideoTutorial = async (page, context, videoTitle) => {
	if (context) await context.close()
	const video = page.video()
	const videoDir = path.resolve(__dirname, 'videos')
	const videoPath = await video?.path()

	if (video && videoPath) {
		await fs.rename(videoPath, `${videoDir}/${videoTitle}.webm`)
	}
}

test('make all the screenshots', async ({ page }) => {
  await page.goto('/register')
  await page.screenshot({ path: 'screens/register.png', fullPage: true });
});

test('how to setup did on pb', async ({ page, context }) => {
  await page.goto('http://localhost:8090/_/');
  await page.goto('http://localhost:8090/_/#/login');
  await page.getByLabel('Email').fill('admin@example.org');
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill('adminadmin');
  await page.getByRole('button', { name: 'Login ' }).click();
  await page.getByRole('link', { name: ' features Pin collection' }).click();
  await page.getByText('{"DID_IDENTITY":"string').click();
  await page.getByText('"string"', { exact: true }).nth(1).click();
  await page.getByText('{ "DID_IDENTITY": "stri').press('ArrowRight');
  await page.getByText('{ "DID_IDENTITY": "stri').fill('{\n  "DID_IDENTITY": "string",\n  "DID_KEYRING": "json, currently passed base64 encoded",\n  "DID_SIGNER_SPEC": "string",\n  "DID_SPEC": "string",\n  "DID_URL": "url"\n}');
  await expect(page.getByText('{"DID_IDENTITY":"stri')).toBeVisible();
  saveVideoTutorial(page, context, 'setup-did')
});


test('Register a user', async ({ page, context }) => {
  await page.goto('http://localhost:4173/register');
  await page.getByPlaceholder('name@email.com').click();
  await page.getByPlaceholder('name@email.com').fill('marius@dyne.org');
  await page.getByPlaceholder('name@email.com').press('Tab');
  await page.getByPlaceholder('John Doe').fill('Marius Porets');
  await page.getByPlaceholder('John Doe').press('Tab');
  await page.locator('input[name="password"]').fill('gigiriva5');
  await page.locator('input[name="password"]').press('Tab');
  await page.locator('input[name="passwordConfirm"]').fill('gigiriva5');
  await page.locator('input[name="passwordConfirm"]').press('Tab');
  await page.getByLabel('').check();
  await page.getByLabel('').press('Tab');
  await page.getByRole('link', { name: 'Terms and Conditions' }).press('Tab');
  await page.getByRole('button', { name: 'Create an account' }).press('Enter');
  await page.locator('input[name="questions\\.question1"]').click();
  await page.locator('input[name="questions\\.question1"]').fill('Paris');
  await page.locator('input[name="questions\\.question2"]').click();
  await page.locator('input[name="questions\\.question2"]').fill('Bob');
  await page.locator('input[name="questions\\.question3"]').click();
  await page.locator('input[name="questions\\.question3"]').fill('Prague');
  await page.getByRole('button', { name: 'Generate private keys' }).click();
  await expect(page.getByRole('button', { name: 'clipboard document Copy seed' })).toBeVisible();
  saveVideoTutorial(page, context, 'registration');
});

