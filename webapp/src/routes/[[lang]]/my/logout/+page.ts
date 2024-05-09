import { browser } from '$app/environment';
<<<<<<< ours
import { redirect } from '$lib/i18n/index.js';
import { currentUser, pb } from '$lib/pocketbase';

export const load = async ({ url }) => {
=======
import { currentUser, pb } from '$lib/pocketbase';
import { redirect } from '@sveltejs/kit';

export const load = async () => {
>>>>>>> theirs
	if (browser) {
		localStorage.clear();
		pb.authStore.clear();
		currentUser.set(null);
<<<<<<< ours
		throw redirect(url, '/');
=======
		throw redirect(303, '/');
>>>>>>> theirs
	}
};
