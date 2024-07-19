// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('/tests/collection-manager');
});

test(`on add new record should open modal`, async ({ page }) => {
	await page.getByRole('button', { name: 'Add entry' }).click();
	await expect(page.getByRole('dialog')).toBeVisible();
});
