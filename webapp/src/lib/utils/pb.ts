import type { UsersResponse } from '$lib/pocketbase/types';

export function getUserDisplayName(user: UsersResponse) {
	return user.name ? user.name : user.username ? user.username : user.email;
}
