// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { pb } from '$lib/pocketbase';

//

export async function requestDownloadMicroservices(organizationId: string, fetchFn = fetch) {
	return await fetchFn(`/api/download-microservices-${organizationId}`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${pb.authStore.token}`
		}
	});
}
