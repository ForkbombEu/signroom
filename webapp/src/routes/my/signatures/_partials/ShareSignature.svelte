<script lang="ts">
	import {
		Collections,
		type AuthorizationsRecord,
		type SignaturesRecord
	} from '$lib/pocketbase-types';
	import type { Record } from 'pocketbase';

	import CrudForm from '$lib/schema/CRUDForm.svelte';
	import { Button, Modal, Spinner, P } from 'flowbite-svelte';
	import { currentUser, pb } from '$lib/pocketbase';
	import { ArrowLeft, Trash } from 'svelte-heros-v2';
	import { createEventDispatcher } from 'svelte';
	import type { PBResponse } from '$lib/utils/types';
	import { createTypeProp } from '$lib/utils/typeProp';

	export let open = false;
	export let record: PBResponse<SignaturesRecord>;

	const dispatch = createEventDispatcher<{ add: {}; remove: {} }>();

	/* Load */

	type Authorization = PBResponse<AuthorizationsRecord>;
	let authorizationRecord: Authorization | undefined;
	const authorizationRequest = loadAuthorization();

	async function loadAuthorization(): Promise<{
		authorization: Authorization | undefined;
	}> {
		try {
			const authorization = await pb
				.collection(Collections.Authorizations)
				.getFirstListItem<Authorization>(`record_id="${record.id}"`);
			authorizationRecord = authorization;
			return { authorization };
		} catch (e) {
			return { authorization: undefined };
		}
	}

	/* Success */

	function handleSuccess() {
		open = false;
		dispatch('add');
	}

	/* Remove */

	let removeAccess = false;
	let removeLoading = false;

	function toggleRemoveAccess() {
		removeAccess = !removeAccess;
	}

	async function removeAuthorization() {
		if (!authorizationRecord) return;
		removeLoading = true;
		await pb.collection(Collections.Authorizations).delete(authorizationRecord.id);
		open = false;
		dispatch('remove');
	}
	export let recordType = createTypeProp<AuthorizationsRecord>();
	
</script>

{#await authorizationRequest}
	<Spinner />
{:then { authorization }}
	<div class="fixed z-50">
		<Modal bind:open size="md" title="Share signature">
			<div class="md:w-full relative">
				{#if !removeAccess}
					<CrudForm
						on:success={handleSuccess}
						{recordType}
						initialData={authorization}
						submitButtonText="Share"
						collection={Collections.Authorizations}
						fieldsSettings={{
							hide: {'record_id':record.id, 'collection_id':record.collectionId, 'owner':$currentUser?.id},
							relations: {
								users: {displayFields:['email'],inputMode:'search'}
							},
						}}
					/>
					{#if authorization}
						<div class="absolute left-0 bottom-0">
							<Button color="red" outline on:click={toggleRemoveAccess}>
								<Trash size="20" />
								<span class="ml-2"> Remove access </span>
							</Button>
						</div>
					{/if}
				{:else if removeLoading}
					<Spinner />
				{:else}
					<P>Are you sure you want to remove all access to the signature?</P>
					<div class="flex justify-between mt-4">
						<Button class="space-x-2" color="alternative" on:click={toggleRemoveAccess}>
							<ArrowLeft size="20" />
							<span class="ml-2"> Undo </span>
						</Button>
						<Button class="space-x-2" color="red" on:click={removeAuthorization}>
							<Trash size="20" />
							<span class="ml-2"> Yes, remove access </span>
						</Button>
					</div>
				{/if}
			</div>
		</Modal>
	</div>
{/await}
