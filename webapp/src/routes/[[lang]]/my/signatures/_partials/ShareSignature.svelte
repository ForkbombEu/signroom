<script lang="ts">
	import {
		Collections,
		type AuthorizationsRecord,
		type SignaturesRecord,
		type SignaturesResponse,
		type AuthorizationsResponse
	} from '$lib/pocketbase/types';

	import { RecordForm } from '$lib/recordForm';
	import { Button, Modal, Spinner, P } from 'flowbite-svelte';
	import { currentUser, pb } from '$lib/pocketbase';
	import { ArrowLeft, Trash } from 'svelte-heros-v2';
	import { createEventDispatcher } from 'svelte';
	import type { PBResponse } from '$lib/utils/types';
	import { createTypeProp } from '$lib/utils/typeProp';
	import { m } from '$lib/i18n';

	export let open = false;
	export let record: SignaturesResponse;

	const dispatch = createEventDispatcher<{ add: undefined; remove: undefined }>();

	/* Load */

	// type Authorization = PBResponse<AuthorizationsRecord>;
	let authorizationRecord: AuthorizationsResponse | undefined;
	const authorizationRequest = loadAuthorization();

	async function loadAuthorization(): Promise<{
		authorization: AuthorizationsResponse | undefined;
	}> {
		try {
			const authorization = await pb
				.collection(Collections.Authorizations)
				.getFirstListItem<AuthorizationsResponse>(`record_id="${record.id}"`);
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
		await pb.collection('authorizations').delete(authorizationRecord.id);
		open = false;
		dispatch('remove');
	}
	export let recordType = createTypeProp<AuthorizationsResponse>();
</script>

{#await authorizationRequest}
	<Spinner />
{:then { authorization }}
	<div class="fixed z-50">
		<Modal bind:open size="md" title="Share signature">
			<div class="relative md:w-full">
				{#if !removeAccess}
					<RecordForm
						on:success={handleSuccess}
						{recordType}
						initialData={authorization}
						submitButtonText="Share"
						collection={Collections.Authorizations}
						fieldsSettings={{
							hide: {
								record_id: record.id,
								collection_id: record.collectionId,
								owner: $currentUser?.id
							},
							relations: {
								users: { displayFields: ['email'], inputMode: 'search' }
							}
						}}
					/>
					{#if authorization}
						<div class="absolute bottom-0 left-0">
							<Button color="red" outline on:click={toggleRemoveAccess}>
								<Trash size="20" />
								<span class="ml-2"> {m.Remove_access()} </span>
							</Button>
						</div>
					{/if}
				{:else if removeLoading}
					<Spinner />
				{:else}
					<P>{m.Are_you_sure_you_want_to_remove_all_access_to_the_signature()}</P>
					<div class="mt-4 flex justify-between">
						<Button class="space-x-2" color="alternative" on:click={toggleRemoveAccess}>
							<ArrowLeft size="20" />
							<span class="ml-2"> {m.Undo()} </span>
						</Button>
						<Button class="space-x-2" color="red" on:click={removeAuthorization}>
							<Trash size="20" />
							<span class="ml-2"> {m.Yes_remove_access()} </span>
						</Button>
					</div>
				{/if}
			</div>
		</Modal>
	</div>
{/await}
