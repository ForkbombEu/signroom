// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { type Page, expect } from '@playwright/test';
import { nanoid } from 'nanoid';

export async function createOrganization(page: Page) {
	let organizationName = `org-${nanoid(5)}`;

	await page.goto('/my');
	await expect(page).toHaveURL(/my/);

	const organizationsLink = page.getByRole('link', { name: 'My organizations' });
	await expect(organizationsLink).toBeVisible();
	await organizationsLink.click();

	await page.getByRole('button', { name: 'Create a new organization' }).click();
	await page.locator('input[name="name"]').click();
	await page.locator('input[name="name"]').fill(organizationName);
	await page.getByRole('button', { name: 'Create organization' }).click();

	const organizationTitle = page.getByRole('heading', { name: organizationName });
	await expect(organizationTitle).toBeVisible();
}
