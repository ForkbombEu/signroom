import { pb } from '$lib/pocketbase';
import {
	Collections,
	type UsersPublicKeysRecord,
	type UsersPublicKeysResponse
} from '$lib/pocketbase/types';
import _ from 'lodash';
import type { Keypair } from './keypair';

export type PublicKeys = Omit<UsersPublicKeysRecord, 'owner'>;

export function getPublicKeysFromKeypair(keypair: Keypair): PublicKeys {
	const publicKeys: Partial<Keypair> = _.cloneDeep(keypair);
	delete publicKeys.seed;
	delete publicKeys.keyring;
	return keypair;
}

export async function getUserPublicKeys() {
	try {
		return await pb
			.collection(Collections.UsersPublicKeys)
			.getFirstListItem<UsersPublicKeysResponse>(`owner.id = '${pb.authStore.model?.id}'`);
	} catch (e) {
		return undefined;
	}
}

export async function saveUserPublicKeys(publicKeys: PublicKeys) {
	const data: UsersPublicKeysRecord = {
		...publicKeys,
		owner: pb.authStore.model?.id
	};
	await pb.collection(Collections.UsersPublicKeys).create(data);
}
