// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { browser } from '$app/environment';
import { pb } from '$lib/pocketbase';

export const load = async ({ params }) => {
	if (!browser) return;

	const userAuthorization = await pb
		.collection('orgAuthorizations')
		.getFirstListItem(`user = "${pb.authStore.model!.id}" && organization = "${params.id}"`);

	const userRole = await pb.collection('orgRoles').getOne(userAuthorization.role);

	return {
		userAuthorization,
		userRole
	};
};
