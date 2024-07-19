// SPDX-FileCopyrightText: 2024 The Forkbomb Company
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { getUserPublicKeys } from '$lib/keypairoom/utils';

export async function getUserDidUrl(userId: string | undefined = undefined) {
	const publicKeys = await getUserPublicKeys(userId);
	if (publicKeys) return createDidUrl(publicKeys.eddsa_public_key);
}

export function createDidUrl(eddsaPublicKey: string) {
	return `https://explorer.did.dyne.org/details/did:dyne:sandbox.signroom:${eddsaPublicKey}`;
}
