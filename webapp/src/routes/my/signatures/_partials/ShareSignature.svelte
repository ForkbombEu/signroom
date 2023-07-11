<script lang="ts">
	import { Collections, type SignaturesRecord } from '$lib/pocketbase-types';
	import type { Record } from 'pocketbase';

	import CrudForm, { formMode, type FormMode } from '$lib/schema/CRUDForm.svelte';
	import { Modal } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { currentUser, pb } from '$lib/pocketbase';
	import { log } from 'debug';

	export let open = false;
	export let record: Record & SignaturesRecord;

	let initialData: any = {};
	let mode: FormMode = formMode.CREATE;

	onMount(async () => {
		try {
			const authorization = await pb
				.collection(Collections.Authorizations)
				.getFirstListItem(`record_id="${record.id}"`);
			initialData = authorization;
			mode = formMode.EDIT;
		} catch (e) {
			log(e);
		}
	});
</script>

<div class="fixed z-50">
	<Modal bind:open size="xl" title="Share signature">
		<div class="w-[500px]">
			<CrudForm
				{initialData}
				{mode}
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
