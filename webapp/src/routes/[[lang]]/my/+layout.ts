// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { verifyUser } from '$lib/auth/verifyUser';
import { loadFeatureFlags } from '$lib/features';
import { error } from '@sveltejs/kit';

import { browser } from '$app/environment';
import { redirect } from '$lib/i18n';
import { getKeyringFromLocalStorage, matchPublicAndPrivateKeys } from '$lib/keypairoom/keypair';
import { getUserPublicKeys, RegenerateKeyringSession } from '$lib/keypairoom/utils';

import { OrganizationInviteSession } from '$lib/organizations/invites/index.js';

export const load = async ({ url, fetch }) => {
	if (!browser) return;
	const featureFlags = await loadFeatureFlags();

	// Auth

	if (!featureFlags.AUTH) error(404);
	if (!(await verifyUser(fetch))) redirect('/login', url);

	// Keypairoom

	if (featureFlags.KEYPAIROOM) {
		const publicKeys = await getUserPublicKeys();
		if (!publicKeys) redirect('/keypairoom', url);

		const keyring = getKeyringFromLocalStorage();
		if (!keyring) {
			RegenerateKeyringSession.start();
			redirect(`/keypairoom/regenerate`, url);
		}

		try {
			if (publicKeys && keyring) await matchPublicAndPrivateKeys(publicKeys, keyring);
		} catch (e) {
			RegenerateKeyringSession.start();
			redirect(`/keypairoom/regenerate`, url);
		}
	}
	if (featureFlags.KEYPAIROOM && RegenerateKeyringSession.isActive()) {
		RegenerateKeyringSession.end();
	}

	// Organizations

	if (featureFlags.ORGANIZATIONS && OrganizationInviteSession.isActive()) {
		OrganizationInviteSession.end();
		redirect(`/my/organizations`, url);
	}
};
