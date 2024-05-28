<script lang="ts">
	import {
		registerUser,
		isWebauthnSupported,
		isPlatformAuthenticatorAvailable
	} from '$lib/webauthn';
	import { currentUser } from '$lib/pocketbase';

	import { Collections, type WebauthnCredentialsResponse } from '$lib/pocketbase/types';
	import { CollectionManager, DeleteRecord, EditRecord, Pagination } from '$lib/collectionManager';
	import { m } from '$lib/i18n';

	import { InformationCircle, Plus } from 'svelte-heros-v2';
	import { Alert, Button, Card, Heading, P, Spinner } from 'flowbite-svelte';
	import { createTypeProp } from '$lib/utils/typeProp';

	const platformAuthenticatorAvailable = isPlatformAuthenticatorAvailable();
	const recordType = createTypeProp<WebauthnCredentialsResponse<{ ID: string }>>();

	const userEmailAddress = $currentUser?.email!;
</script>

<Heading tag="h6">{m.Your_devices()}</Heading>
<P color="gray" size="sm">{m.Manage_the_devices_you_use_to_login_()}</P>

<CollectionManager
	{recordType}
	collection={Collections.WebauthnCredentials}
	let:records
	editFormSettings={{ exclude: ['user', 'credential'] }}
	hideEmptyState
>
	<div class="space-y-2 py-4">
		{#each records as record}
			{@const label = Boolean(record.description) ? record.description : record.credential?.ID}
			<Card class="max-w-none">
				<div class="flex items-center justify-between gap-4">
					<div class="w-0 grow overflow-hidden">
						<P>{label}</P>
					</div>
					<div class="flex gap-2">
						<EditRecord {record} />
						<DeleteRecord {record} />
					</div>
				</div>
			</Card>
		{/each}
		<Pagination />
	</div>
</CollectionManager>

{#await platformAuthenticatorAvailable}
	<div class="flex flex-col items-center">
		<Spinner />
		<P>{m.Checking_your_device()}</P>
	</div>
{:then response}
	{#if !response || !isWebauthnSupported()}
		<Alert color="yellow" class="mt-2">
			<svelte:fragment slot="icon">
				<InformationCircle />
			</svelte:fragment>
			<span>
				{m.Your_device_does_not_have_integrated_Webauthn_support_An_external_authenticator_is_required_()}
			</span>
		</Alert>
	{/if}
{/await}

<div class="mt-2 flex justify-end">
	<Button
		color="alternative"
		on:click={() => {
			registerUser(userEmailAddress, navigator.userAgent);
		}}
	>
		<Plus size="20" class="mr-1" />
		{m.Add_a_device()}
	</Button>
</div>
