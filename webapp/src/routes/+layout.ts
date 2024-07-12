// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { loadFeatureFlags } from '$lib/features';

export const ssr = false;

export const load = async ({ fetch }) => {
	await loadFeatureFlags(fetch);
};
