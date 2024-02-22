import { browser } from '$app/environment';
import { redirect } from '$lib/i18n/index.js';
import { currentUser, pb } from '$lib/pocketbase';

export const load = async ({ url }) => {
	if (browser) {
		localStorage.clear();
		pb.authStore.clear();
		currentUser.set(null);
		throw redirect(url, '/');
	}
};
