<script lang="ts">
	import { Collections, type AuthorizationsRecord } from '$lib/pocketbase-types';
	import type { Record } from 'pocketbase';

	import CrudForm, { formMode, type FormMode } from '$lib/schema/CRUDForm.svelte';
	import { Button, Modal, Spinner, P } from 'flowbite-svelte';
	import { currentUser, pb } from '$lib/pocketbase';
	import { ArrowLeft, Share, Trash } from 'svelte-heros-v2';
	import { createEventDispatcher } from 'svelte';

	let open = false;
	export let record: Record;

	let openShareModal = (r: Record) => {
		open = true;
	};

	const dispatch = createEventDispatcher<{ add: {}; remove: {} }>();

	/* Load */

	type Authorization = Record & AuthorizationsRecord;
	let authorizationRecord: Authorization | undefined;
	const authorizationRequest = loadAuthorization();

	async function loadAuthorization(): Promise<{
		authorization: Authorization | undefined;
		mode: FormMode;
	}> {
		try {
			const authorization = await pb
				.collection(Collections.Authorizations)
				.getFirstListItem<Authorization>(`record_id="${record.id}"`);
			authorizationRecord = authorization;
			return { authorization, mode: formMode.EDIT };
		} catch (e) {
			return { authorization: undefined, mode: formMode.CREATE };
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
</script>

<Button
	class="!p-2"
	color="alternative"
	on:click={() => {
		openShareModal(record);
	}}
>
	<Share size="20" />
</Button>

{#await authorizationRequest}
	<Spinner />
{:then { authorization, mode }}
	<div class="fixed z-50">
		<Modal bind:open size="xl" title="Share signature">
			<div class="w-[500px] relative">
				{#if !removeAccess}
					<CrudForm
						on:success={handleSuccess}
						initialData={authorization}
						{mode}
						submitButtonText="Share"
						collection={Collections.Authorizations}
						formSettings={{
							hiddenFields: ['record_id', 'collection_id', 'owner'],
							hiddenFieldsValues: {
								record_id: record.id,
								collection_id: record.collectionId,
								owner: $currentUser?.id
							},
							relationsDisplayFields: {
								users: ['email']
							}
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

