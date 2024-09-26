// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { verifyUserRole } from '$lib/organizations';
import { error } from '@sveltejs/kit';

export const load = async ({ params, fetch }) => {
	const { hasRole } = await verifyUserRole(params.id, ['admin', 'owner'], fetch);
	if (!hasRole) error(404);
};
