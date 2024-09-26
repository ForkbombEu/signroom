// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { blockMembersWithoutRoles } from '$lib/organizations';

export const load = async ({ params, fetch }) => {
	await blockMembersWithoutRoles(params.id, ['admin', 'owner'], fetch);
};
