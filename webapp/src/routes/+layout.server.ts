// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { loadFeatureFlags } from '$lib/features';
import { error } from '@sveltejs/kit';

export const ssr = false;

export const load = async ({ fetch }) => {
	const flags = await loadFeatureFlags(fetch);
	if (flags.MAINTENANCE) {
		error(503);
	}
};
