<script lang="ts">
	import { Badge, Button, Heading, Modal, TableBodyCell, TableHeadCell } from 'flowbite-svelte';
	import {
		Form,
		createForm,
		FormError,
		Input,
		SubmitButton,
		File as FileInput,
		zodFile
	} from '$lib/forms';
	import { z } from 'zod';
	import {
		CollectionManager,
		CollectionManagerHeader,
		CollectionTable,
		CollectionEmptyState
	} from '$lib/collectionManager';
	import {
		Collections,
		type CertificatesResponse,
		type CertificatesRecord
	} from '$lib/pocketbase/types';
	import { currentUser } from '$lib/pocketbase';
	import { createTypeProp } from '$lib/utils/typeProp';
	import PortalWrapper from '$lib/components/portalWrapper.svelte';
	import { Plus, ArrowUpTray } from 'svelte-heros-v2';
	import DeleteRecord from '$lib/collectionManager/ui/recordActions/deleteRecord.svelte';
	import { createToggleStore } from '$lib/components/utils/toggleStore';
	import { nanoid } from 'nanoid';
	import {
		readKeyFromLocalStorage,
		addKey,
		addCertifcateAndKey,
		addAutosingedCertificateAndKey
	} from '$lib/signatures/certificates';
	import PageContent from '$lib/components/pageContent.svelte';
	import PageCard from '$lib/components/pageCard.svelte';

	const schema = z.object({
		name: z.string(),
		certificate: zodFile(),
		key: zodFile()
	});

	const superform = createForm(
		schema,
		async ({ form }) => {
			const { data } = form;
			const certificate = await readFile(data.certificate as File);
			const key = await readFile(data.key as File);
			await addCertifcateAndKey(data.name, certificate, key, $currentUser!.id);
			showModal = false;
		},
		undefined,
		{
			id: nanoid(5),
			dataType: 'form'
		}
	);

	async function readFile(file: File) {
		let res: string = await new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsText(file);
			reader.onload = () => {
				resolve(reader.result as string);
			};
		});
		return res.trim();
	}

	function onCertificateDelete(certificate: CertificatesResponse) {
		const allKeys = readKeyFromLocalStorage();
		delete allKeys[certificate.name];
		localStorage.setItem('certificateKey', JSON.stringify(allKeys));
	}

	function checkCertificateKeyInLocalStorage(certificate: CertificatesRecord): boolean {
		const allKeys = readKeyFromLocalStorage();
		return Boolean(allKeys[certificate.name]);
	}

	//

	const recordType = createTypeProp<CertificatesResponse>();

	let showModal = false;

	/* Upload key modal */

	let keyUploadModal = createToggleStore(false);
	let keyUploadCertificate: CertificatesResponse | undefined = undefined;

	const keyUploadFormSchema = z.object({
		key: zodFile()
	});

	const keyUploadForm = createForm(
		keyUploadFormSchema,
		async ({ form }) => {
			if (!keyUploadCertificate) return;
			const key = form.data.key as File;
			const keyContent = await readFile(key);
			await addKey(keyUploadCertificate.name, keyUploadCertificate.algorithm, keyContent, false);
			delete form.data.key;
			keyUploadModal = createToggleStore(false);
		},
		undefined,
		{
			id: nanoid(5),
			dataType: 'form'
		}
	);

	//

	/* Create autosigned certificate modal */

	let showAutosignedModal = false;

	const autosignedCertFormSchema = z.object({
		name: z.string()
	});
	const autosignedCertForm = createForm(
		autosignedCertFormSchema,
		async ({ form }) => {
			const { data } = form;
			await addAutosingedCertificateAndKey(data.name, $currentUser!.id);
			showAutosignedModal = false;
		},
		undefined,
		{
			id: nanoid(5),
			dataType: 'form'
		}
	);
</script>

<PageContent>
	<PageCard>
		<div class="space-y-4 rounded-lg border-slate-200 p-4">
			<CollectionManager
				collection={Collections.Certificates}
				{recordType}
				let:records
				hideEmptyState
			>
				<CollectionManagerHeader hideCreateButton>
					<svelte:fragment slot="title">
						<Heading tag="h4">My Certificates</Heading>
					</svelte:fragment>
					<svelte:fragment slot="actions">
						<Button on:click={() => (showModal = true)}>
							<Plus />
							<span class="ml-2"> Add a Key-Certificate Pair </span>
						</Button>
					</svelte:fragment>
				</CollectionManagerHeader>

				<CollectionTable
					{records}
					fields={['name', 'algorithm']}
					hideActions={['select', 'edit', 'share', 'delete']}
				>
					<svelte:fragment slot="emptyState">
						<CollectionEmptyState
							title="No certificate here"
							description="Start by creating an autosigned certificate"
							hideCreateButton
						>
							<svelte:fragment slot="bottom">
								<Button color="alternative" on:click={() => (showAutosignedModal = true)}>
									<Plus />
									<span class="ml-2"> Generate an autosigned certificate </span>
								</Button>
							</svelte:fragment>
						</CollectionEmptyState>
					</svelte:fragment>

					<svelte:fragment slot="header">
						<TableHeadCell>Key status</TableHeadCell>
					</svelte:fragment>
					<svelte:fragment slot="row" let:record>
						{@const keyExists = checkCertificateKeyInLocalStorage(record)}
						<TableBodyCell>
							{#if keyExists}
								<Badge color="green">Available</Badge>
							{:else}
								<div class="flex items-center gap-2">
									<Badge color="red">Missing</Badge>
									<Button
										size="xs"
										color="alternative"
										on:click={() => {
											keyUploadCertificate = record;
											keyUploadModal.on();
										}}
									>
										<ArrowUpTray size="16"></ArrowUpTray>
										<span class="ml-1.5">Load key</span>
									</Button>
								</div>
							{/if}
						</TableBodyCell>
					</svelte:fragment>

					<svelte:fragment slot="actions" let:record>
						<DeleteRecord
							{record}
							on:delete={(e) => {
								onCertificateDelete(e.detail.record);
							}}
						/>
					</svelte:fragment>
				</CollectionTable>
			</CollectionManager>
		</div>

		<PortalWrapper>
			<Modal bind:open={showModal} size="md" title="Key and certificate" placement="center">
				<Form {superform}>
					<Input
						{superform}
						field="name"
						options={{ id: 'name', label: 'Insert your certificate name' }}
					/>
					<FileInput
						{superform}
						field="certificate"
						options={{ id: 'certificate', label: 'Select your certificate' }}
					/>
					<FileInput {superform} field="key" options={{ id: 'key', label: 'Select your key' }} />
					<FormError />
					<dir class="flex justify-end">
						<SubmitButton>Submit certificate and key</SubmitButton>
					</dir>
				</Form>
			</Modal>

			<Modal bind:open={$keyUploadModal} size="md" title="Load key" placement="center">
				<Form superform={keyUploadForm}>
					<FileInput superform={keyUploadForm} field="key" options={{ label: 'Select your key' }} />
					<FormError />
					<dir class="flex justify-end">
						<SubmitButton>Submit key</SubmitButton>
					</dir>
				</Form>
			</Modal>

			<Modal
				bind:open={showAutosignedModal}
				size="md"
				title="Autosigned certificate"
				placement="center"
			>
				<Form superform={autosignedCertForm}>
					<Input
						superform={autosignedCertForm}
						field="name"
						options={{ id: 'name', label: 'Insert the  certificate name' }}
					/>
					<FormError />
					<dir class="flex justify-end">
						<SubmitButton>Submit name</SubmitButton>
					</dir>
				</Form>
			</Modal>
		</PortalWrapper>
	</PageCard>
</PageContent>
