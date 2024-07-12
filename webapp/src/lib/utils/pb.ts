// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import type { UsersResponse } from '$lib/pocketbase/types';

export function getUserDisplayName(user: UsersResponse) {
	return user.name ? user.name : user.username ? user.username : user.email;
}
