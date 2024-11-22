// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { error } from '@sveltejs/kit';
import { verifyUserMembership, verifyUserRole } from './verify-authorizations';
import type { OrgRole } from './roles';

export async function blockNonMembers(organizationId: string, fetchFn = fetch) {
	const { isMember } = await verifyUserMembership(organizationId, fetchFn);
	if (!isMember) error(404);
}

export async function blockMembersWithoutRoles(
	organizationId: string,
	roles: OrgRole[],
	fetchFn = fetch
) {
	const { hasRole } = await verifyUserRole(organizationId, roles, fetchFn);
	if (!hasRole) error(404);
}