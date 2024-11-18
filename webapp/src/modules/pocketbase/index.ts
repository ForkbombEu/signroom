import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import PocketBase, { type RecordSubscription } from 'pocketbase';
import { writable } from 'svelte/store';
import type { CollectionResponses, TypedPocketBase, UsersResponse } from '@/pocketbase/types';
import type { CollectionName } from './collections-models';
import { onMount } from 'svelte';
import type { MaybePromise } from '@/utils/types';

//

export const pb = new PocketBase(PUBLIC_POCKETBASE_URL) as TypedPocketBase;

export const currentUser = writable(pb.authStore.model as AuthStoreModel);
export type AuthStoreModel = UsersResponse | null;

//

export function setupComponentPbSubscriptions<C extends CollectionName>(
	collection: C,
	callback: (data: RecordSubscription<CollectionResponses[C]>) => MaybePromise<void>
) {
	onMount(() => {
		const unsubscribeFunctionPromise = pb.collection(collection).subscribe('*', callback);
		return async () => {
			const unsubscribeFunction = await unsubscribeFunctionPromise;
			await unsubscribeFunction();
		};
	});
}
