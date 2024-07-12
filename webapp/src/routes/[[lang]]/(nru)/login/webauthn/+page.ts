// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { loadFeatureFlags } from '$lib/features';
import { error } from '@sveltejs/kit';

export const load = async ({ fetch }) => {
	const { WEBAUTHN } = await loadFeatureFlags(fetch);
	if (!WEBAUTHN) {
		error(404);
	}
};
