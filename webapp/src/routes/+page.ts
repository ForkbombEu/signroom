import { redirect } from '@sveltejs/kit';
import { verifyUser } from '$lib/auth/verifyUser';

export const load = async ({ fetch }) => {
	if (await verifyUser(fetch)) throw redirect(303, '/my');
};
