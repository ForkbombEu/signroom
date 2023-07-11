<script lang="ts">
	import { Collections, type SignaturesRecord } from '$lib/pocketbase-types';
	import type { Record } from 'pocketbase';

	import CrudForm, { formMode, type FormMode } from '$lib/schema/CRUDForm.svelte';
	import { Modal, Spinner } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { currentUser, pb } from '$lib/pocketbase';
	import { log } from 'debug';

	export let open = false;
	export let record: Record & SignaturesRecord;

	const authorizationRequest = loadAuthorization();

	async function loadAuthorization(): Promise<{
		authorization: Record | undefined;
		mode: FormMode;
	}> {
		try {
			const authorization = await pb
				.collection(Collections.Authorizations)
				.getFirstListItem(`record_id="${record.id}"`);
			return { authorization, mode: formMode.EDIT };
		} catch (e) {
			return { authorization: undefined, mode: formMode.CREATE };
		}
	}
</script>

{#await authorizationRequest}
	<Spinner />
{:then { authorization, mode }}
	<div class="fixed z-50">
		<Modal bind:open size="xl" title="Share signature">
			<div class="w-[500px]">
				<CrudForm
					on:success
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
			</div>
		</Modal>
	</div>
{/await}
