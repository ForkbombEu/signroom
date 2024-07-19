// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { redirect } from '$lib/i18n';
import { verifyUser } from '$lib/auth/verifyUser';

export const load = async ({ fetch, url }) => {
	if (await verifyUser(fetch)) redirect('/my', url);
};
