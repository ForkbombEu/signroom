// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { loadFeatureFlags } from '$lib/features';
import { error } from '@sveltejs/kit';

export const load = async ({ fetch }) => {
	if (!(await loadFeatureFlags(fetch)).KEYPAIROOM) error(404);
};
