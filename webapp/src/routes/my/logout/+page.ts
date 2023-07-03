import { currentUser, pb } from '$lib/pocketbase';
import { redirect } from '@sveltejs/kit';

export const load = async () => {
	localStorage.clear();
	pb.authStore.clear();
	currentUser.set(null);
	throw redirect(303, '/');
};
