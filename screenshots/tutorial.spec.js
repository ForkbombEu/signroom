// @ts-check
import { test, expect } from '@playwright/test'
import fs from 'fs/promises'
import path from 'path'

/**
 *  A convenience method that handles gracefully cleaning up the test run.
 */
export const cleanUp = async (page, context, videoTitle) => {
	// context may be undefined if already handled/closed from within a test
	if (context) {
		await context.close()
	}

	const video = page.video()
        // relative path to wherever you are saving your videos
	const videoDir = path.resolve(__dirname, 'videos')
	const videoPath = await video?.path()

	if (video && videoPath) {
		await fs.rename(videoPath, `${videoDir}/${videoTitle}.webm`)
	}
}

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
  cleanUp(page, context, 'setup-did')
});
