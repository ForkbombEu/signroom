// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { pb } from '$lib/pocketbase';
import type { OrgRole } from './roles';
import { type OrgAuthorizationsResponse, type OrgRolesResponse } from '$lib/pocketbase/types';
import { Option as O } from 'effect';

export async function getUserRole(organizationId: string, userId: string): Promise<OrgRole> {
	type AuthorizationWithRole = OrgAuthorizationsResponse<{ role: OrgRolesResponse }>;

	const orgAuthorization = await pb
		.collection('orgAuthorizations')
		.getFirstListItem<AuthorizationWithRole>(
			`organization.id = '${organizationId}' && user.id = '${userId}'`,
			{
				expand: 'role',
				requestKey: null
			}
		);

	return O.fromNullable(orgAuthorization.expand?.role.name).pipe(O.getOrThrow) as OrgRole;
}
