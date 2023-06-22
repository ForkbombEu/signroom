import { browser } from '$app/environment';
import { getKeyringFromLocalStorage } from '$lib/auth/keypair';
import { redirect } from '@sveltejs/kit';

export async function load() {
	if (browser) {
		const keyring = getKeyringFromLocalStorage();
		if (!keyring) throw redirect(303, '/my/keypairoom/regenerate');
	}
}
