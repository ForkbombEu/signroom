// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { pb } from '$lib/pocketbase';
import { Collections, type CrudExampleResponse } from '$lib/pocketbase/types';

export const load = async ({ fetch }) => {
	try {
		const item = await pb
			.collection(Collections.CrudExample)
			.getOne<CrudExampleResponse>('53q5yve2r8scku7', { fetch });
		return { item };
	} catch (_) {
		return {};
	}
};
