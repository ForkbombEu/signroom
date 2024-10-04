// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { loadFeatureFlags } from '$lib/features/index.js';
import { redirect } from '$lib/i18n/index.js';
import { OrganizationInviteSession } from '$lib/organizations/invites';
import { pb } from '$lib/pocketbase/index.js';
import { error } from '@sveltejs/kit';

export const load = async ({ params, url }) => {
	const featureFlags = await loadFeatureFlags();
	if (!featureFlags.ORGANIZATIONS) error(404);

	OrganizationInviteSession.start({
		organizationId: params.orgId,
		inviteId: params.inviteId,
		email: decodeURIComponent(params.email),
		userId: params.userId
	});

	if (pb.authStore.token) redirect('/my/organizations', url);
	else {
		if (params.userId) redirect('/login', url);
		else redirect('/register', url);
	}
};
