// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { pb } from '$lib/pocketbase/index.js';
import type { ClientResponseError } from 'pocketbase';

export const load = async ({ params }) => {
	try {
		const verified = await pb.collection('users').confirmVerification(params.token);
		return { verified };
	} catch (e) {
		return { error: e as ClientResponseError };
	}
};
