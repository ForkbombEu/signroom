// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { test, expect } from '@playwright/test';

test(`redirects to "/my" if logged in and in "/"`, async ({ page }) => {
	await page.goto('/');
	await expect(page).toHaveURL(/my/);
});

test(`redirects to "/my" if logged in and in "/login"`, async ({ page }) => {
	await page.goto('/login');
	await expect(page).toHaveURL(/my/);
});
