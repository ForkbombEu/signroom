// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { test, expect } from '@playwright/test';

test(`redirects to "/login" if not logged in and in "/my"`, async ({ page }) => {
	await page.goto('/my');
	await expect(page).toHaveURL(/login/);
});
