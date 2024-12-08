// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { createSessionStorageHandlers } from '$lib/utils/sessionStorage';

type OrganizationInviteSession = {
	organizationId: string;
	inviteId: string;
	email: string;
	userId?: string | undefined;
};

export const OrganizationInviteSession =
	createSessionStorageHandlers<OrganizationInviteSession>('organization_invite');
