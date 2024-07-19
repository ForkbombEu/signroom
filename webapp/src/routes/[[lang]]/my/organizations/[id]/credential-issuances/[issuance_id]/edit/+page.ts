// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { verifyRole } from '$lib/rbac/index.js';
import { error } from '@sveltejs/kit';

export const load = async ({ params, fetch }) => {
	try {
		await verifyRole(params.id, ['admin', 'owner'], fetch);
	} catch (e) {
		error(404);
	}
};
