import { test, expect, type Page } from '@playwright/test';
import { userLogin, randomId } from '@utils/login';
import { createOrganization } from '@utils/organization';
import { config } from 'dotenv';

config();

test.describe('it should test organizations and members', () => {
	let page: Page;
	let orgName: string;
	let orgId: string;

	test.beforeAll(async ({ browser }) => {
		const context = await browser.newContext();
		page = await context.newPage();
		await page.goto('/my');
	});

	test.afterAll(async ({ browser }) => {
		browser.close;
	});

	test('it should create an organization', async ({ browser }) => {
		page = await userLogin(browser, 'A');
		await createOrganization(page);
		orgId = page.url().split('/').at(-1);
	});

	test('it should edit organization name', async () => {
		await page.getByRole('tab', { name: 'Settings' }).click();
		await expect(page).toHaveURL(/my\/organizations\/[^/]+\/settings/);

		await page.locator('input[name="name"]').click();

		orgName = `org-${randomId()}`;
		await page.locator('input[name="name"]').fill(orgName);
		await page.getByRole('button', { name: 'Save changes' }).click();
		// await expect(page.getByRole('heading', { name: orgName })).toBeVisible();
	});

	test('it should add user B to the organization as admin', async () => {
		await page.getByRole('tab', { name: 'Members' }).click();
		await expect(page).toHaveURL(/my\/organizations\/[^/]+\/members/);

		let username = 'userB';
		let role = 'admin';
		await addMemberWithRole(page, username, role);
		await expect(page.getByRole('dialog')).toBeHidden();
		await expect(page.getByText(`${username} ${role}`)).toBeVisible();
	});

	test('it should add user C to the organization as member', async () => {
		let username = 'userC';
		await addMemberWithRole(page, username, 'member');
		await expect(page.getByRole('dialog')).toBeHidden();
		await expect(page.getByText(username)).toBeVisible();
	});

	test('it should fail to add A as member', async () => {
		await addMemberWithRole(page, 'userA', 'member');
		await expect(page.getByText('Failed to create record.')).toBeVisible();
	});

	test.skip("it should hide the 'settings' section to admin", async ({ browser, page }) => {
		page.close();
		page = await userLogin(browser, 'B');
		await page.goto('/my/organizations');

		await expect(page.getByRole('main').getByText(orgName)).toBeVisible();

		const settingsButton = page.getByTestId(`${orgName} link`);
		await expect(settingsButton).toBeHidden();

		await page.getByRole('main').getByRole('button', { name: orgName }).click();
		await expect(page.getByRole('tab', { name: 'cog Settings' })).toBeHidden();

		await page.goto(`/my/organizations/${orgId}/settings`);
		await expect(page.getByText('unauthorized')).toBeVisible();
	});

	test.skip("it should hide the 'settings' section to user", async ({ browser, page }) => {
		page.close();
		page = await userLogin(browser, 'C');
		await page.goto('/my/organizations');

		await expect(page.getByRole('main').getByText(orgName)).toBeVisible();

		const settingsButton = page.getByTestId(`${orgName} link`);
		await expect(settingsButton).toBeHidden();

		await page.getByRole('main').getByRole('link', { name: orgName }).click();
		await expect(page.getByRole('tab', { name: 'cog Settings' })).toBeHidden();
		await expect(page.getByRole('tab', { name: 'users Members' })).toBeHidden();
	});
});

async function addMemberWithRole(page: Page, username: string, role: string) {
	await page.getByRole('button', { name: 'Add new member' }).click();

	await page.locator('.sv-content').click();
	await page.getByPlaceholder('Select').fill(username);
	await expect(page.locator('.sv-item').filter({ hasText: username })).toBeVisible();
	await page.getByPlaceholder('Select').press('Enter');

	await page.locator('select[name="role"]').selectOption({ label: role });

	await page.getByRole('button', { name: 'Create record' }).click();
}
