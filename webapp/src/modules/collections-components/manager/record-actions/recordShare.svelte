<script lang="ts" generics="C extends CollectionName">
	import IconButton from '@/components/custom/iconButton.svelte';
	import { toast } from 'svelte-sonner';
	import { getExceptionMessage } from '@/utils/errors';
	import { m } from '@/i18n';
	import { createToggleStore } from '@/components/custom/utils';
	import Icon from '@/components/custom/icon.svelte';
	import Dialog from '@/components/custom/dialog.svelte';
	import T from '@/components/custom/t.svelte';
	import Spinner from '@/components/custom/spinner.svelte';
	import { Button } from '@/components/ui/button';
	import { type CollectionResponses, type RecordIdString } from '@/pocketbase/types';
	import { CollectionForm } from '@/collections-components';
	import { currentUser, pb } from '@/pocketbase';
	import { ArrowLeft, Share, Trash } from 'lucide-svelte';
	import type { CollectionName } from '@/pocketbase/collections-models';
	import Alert from '@/components/custom/alert.svelte';
	import LoadingDialog from '@/components/custom/loadingDialog.svelte';

	//

	export let record: CollectionResponses[C];
	export let dialogTitle = m.Share_record();
	export let onAdd: () => void = () => {};
	export let onRemove: () => void = () => {};

	/* */

	const dialogState = createToggleStore(false);
	const loadingState = createToggleStore(false);

	let formState: 'default' | 'removeAccess' = 'default';

	/* Load */

	// TODO - Make a full refactor of how this works, also backend-side

	$: authorizationPromise = loadAuthorization(record.id);

	async function loadAuthorization(recordId: RecordIdString) {
		const records = await pb
			.collection('authorizations')
			.getFullList({ filter: `record_id="${recordId}"`, requestKey: null });
		return records.at(0);
	}

	function handleSuccess() {
		dialogState.off();
		onAdd();
	}

	//

	let error: unknown;

	async function removeAuthorization(recordId: RecordIdString) {
		try {
			loadingState.on();
			await pb.collection('authorizations').delete(recordId);
			toast.info(m.Record_authorization_removed_successfully());
			formState = 'default';
			loadingState.off();
			dialogState.off();
		} catch (e) {
			error = e;
		}
		onRemove();
	}
</script>

<Dialog bind:open={$dialogState} title={dialogTitle} contentClass="my-0">
	<svelte:fragment slot="trigger" let:builder>
		<slot name="trigger" open={dialogState.on} {builder} icon={Share}>
			<IconButton variant="outline" icon={Share} builders={[builder]} />
		</slot>
	</svelte:fragment>

	<svelte:fragment slot="content">
		{#await authorizationPromise}
			<div class="flex items-center justify-center self-stretch p-6">
				<Spinner />
			</div>
		{:then authorization}
			{#if formState == 'default'}
				<CollectionForm
					collection="authorizations"
					onSuccess={handleSuccess}
					initialData={authorization}
					recordId={authorization?.id}
					uiOptions={{
						submitButtonText: authorization ? m.Update_authorizations() : m.Share(),
						triggerToast: true,
						toastText: m.Record_shared_successfully()
					}}
					fieldsOptions={{
						hide: {
							record_id: record.id,
							collection_id: record.collectionId,
							owner: $currentUser?.id
						},
						relations: {
							users: {
								displayFields: ['name'],
								exclude: [$currentUser?.id ?? '']
							}
						}
					}}
				>
					<svelte:fragment slot="footer-left">
						{#if authorization}
							<Button variant="destructive" on:click={() => (formState = 'removeAccess')}>
								<Icon src={Trash} mr />
								{m.Remove_access()}
							</Button>
						{/if}
					</svelte:fragment>
				</CollectionForm>
			{:else if formState == 'removeAccess' && authorization}
				<T>{m.Are_you_sure_you_want_to_remove_access_to_the_record()}</T>

				{#if error}
					<Alert variant="destructive" let:Title let:Description>
						<Title>{m.Error()}</Title>
						<Description>{getExceptionMessage(error)}</Description>
					</Alert>
				{/if}

				<div class="mt-4 flex justify-between">
					<Button variant="outline" on:click={() => (formState = 'default')}>
						<Icon src={ArrowLeft} mr />
						{m.Back()}
					</Button>
					<Button variant="destructive" on:click={() => removeAuthorization(authorization.id)}>
						<Icon src={Trash} mr />
						{m.Yes_remove_access()}
					</Button>
				</div>
			{/if}
		{:catch error}
			<Alert variant="destructive" let:Title let:Description>
				<Title>{m.Error()}</Title>
				<Description>{getExceptionMessage(error)}</Description>
			</Alert>
		{/await}
	</svelte:fragment>
</Dialog>

{#if loadingState}
	<LoadingDialog></LoadingDialog>
{/if}
