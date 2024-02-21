import { browser } from '$app/environment';
import { resolveRoute } from '$lib/i18n/index.js';
import { currentUser, pb } from '$lib/pocketbase';
import { redirect } from '@sveltejs/kit';

export const load = async ({ url }) => {
	if (browser) {
		localStorage.clear();
		pb.authStore.clear();
		currentUser.set(null);
		throw redirect(303, resolveRoute('/', url));
	}
};
