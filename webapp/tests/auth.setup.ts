// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { test as setup } from '@playwright/test';
import { config } from 'dotenv';
import { userLogin } from '@utils/login';

export const authFile = 'playwright/.auth/user.json';

config();

setup('authenticate', async ({ browser }) => {
	const page = await userLogin(browser, 'A');
	await page.context().storageState({ path: authFile });
});
