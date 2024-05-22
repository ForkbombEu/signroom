<script lang="ts">
	import { ArrowKeyDown, Button, Dropdown, DropdownItem, Modal, Spinner, P } from 'flowbite-svelte';

	import TitleDescription from './titleDescription.svelte';
	import { ClipboardDocumentCheck, ExclamationCircle, HandThumbUp } from 'svelte-heros-v2';
	import { getRecordsManagerContext, CreateRecord } from '$lib/collectionManager';
	//@ts-ignore
	import { pb } from '$lib/pocketbase';
	import SignaturesFoldersHead from './signaturesFoldersHead.svelte';
	import type { ToastContent } from '../../routes/my/signatures/+page.svelte';
	import { signData } from './utils/sign';
	import type { ToastContent } from '../../routes/[[lang]]/my/signatures/+page.svelte';
	import SectionTitle from './sectionTitle.svelte';
	import { m } from '$lib/i18n';

	export let folderId: string | null = null;
	export let trigger: (toast: ToastContent) => void;

	const { dataManager, formFieldsSettings } = getRecordsManagerContext();
	const { loadRecords } = dataManager;

	const createRecord = (type: String, cb: () => void) => {
		console.log(formFieldsSettings, 'createRecord', type);
		formFieldsSettings.base.hide!.type = type;
		cb();
	};
	const CERTIFICATE_KEY = 'certificateKey';
	const CERTIFICATE = 'certificate';

	let loading = false;
	let error: any = null;
	let signatureName: string;

	async function sign(record: any) {
		loading = true;
		error = null;

		try {
			const algo = record.type;
			const url = pb.files.getUrl(record, record.file);
			//get the file to sign
			const res = await fetch(url);
			const blob = await res.blob();

			let fb64;
			try {
				fb64 = await new Promise((resolve, reject) => {
					const reader = new FileReader();
					reader.readAsDataURL(blob);
					reader.onerror = (e) => {
						reject(e);
					};
					reader.onload = () => {
						resolve((reader.result as string).split(',')[1]);
					};
				});
			} catch (e) {
				error = e;
				loading = false;
				return;
			}

			const cert = await pb.collection('certificates').getOne(record.certificate);
			const name = cert.name;
			const certPem = cert.value;
			const signatureAlgorithmName = cert.algorithm;
			// current timestamp
			const ts_now = Date.now();
			const sk = JSON.parse(localStorage.getItem(CERTIFICATE_KEY) || '{}');
			if (sk[name] == null) throw 'Empty secret key';
			const secretKey = sk[name].zenroomValue || sk[name].value;
			//2. get data to sign
			const toSign = await fetch('/api/getDataToSign', {
				method: 'POST',
				body: JSON.stringify({ certPem, ts_now, algo, doc: fb64, signatureAlgorithmName }),
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				}
			});
			const toBeSigned = await toSign.json();

			//3. sign digest of data
			const signedDigest = await signData(signatureAlgorithmName, secretKey, toBeSigned.bytes);

			//4. sign document (insert signature)
			const signed = await fetch('/api/signDocument', {
				method: 'POST',
				body: JSON.stringify({
					certPem,
					ts_now,
					algo,
					doc: fb64,
					signatureAlgorithmName,
					signedDigest
				}),
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				}
			});
			const signedDocument = await signed.json();

			//5. save signed document to db
			const formData = new FormData();
			formData.append('signed_file', JSON.stringify(signedDocument));
			const rc = await pb.collection('signatures').update(record.id, formData);
			await loadRecords();
			loading = false;
			signatureName = rc.title;
			trigger('signed');
		} catch (e) {
			error = {};
			error.message = e;
			loading = false;
		}
	}
</script>

<div class="flex flex-col md:flex-row justify-between gap-4 md:items-end items-start mb-8">
	{#if !folderId}
		<SectionTitle
			title={m.my_signatures()}
			description={m.Here_you_can_see_all_your_signatures()}
		/>
	{:else}
		<SignaturesFoldersHead {folderId} />
	{/if}
	<div class="md:ml-4">
		<CreateRecord initialData={{ folder: folderId }} on:success={(e) => sign(e.detail.record)}>
			<svelte:fragment slot="button" let:openModal>
				<Button
					id="new-signature"
					color="primary"
					size="sm"
					class="!px-4 !py-2 whitespace-nowrap gap-2 w-fit"
				>
					<ArrowKeyDown />
					New signature
				</Button>
				<Dropdown class="w-text-sm font-light" title="Popover title" triggeredBy="#new-signature">
					{#each ['xades', 'pades', 'jades', 'cades'] as algo}
						<DropdownItem>
							<Button
								outline
								size="sm"
								class="!px-4 !py-2 whitespace-nowrap gap-2 w-fit"
								on:click={createRecord.bind(null, algo, openModal)}
							>
								<ClipboardDocumentCheck />
								Sign with {algo}
							</Button>
						</DropdownItem>
					{/each}
				</Dropdown>
			</svelte:fragment>
		</CreateRecord>
	</div>
</div>

<div class="fixed m-0 p-0 z-50">
	<Modal open={loading} dismissable={false}>
		<div class="flex flex-col items-center gap-2">
			<Spinner />
			<P>Signing document, please wait</P>
		</div>
	</Modal>
	<Modal open={error}>
		<div class="flex items-center gap-2 p-4 text-red-500">
			<ExclamationCircle size="30" />
			<P>{error.message}</P>
		</div>
	</Modal>
	<Modal open={!!signatureName}>
		<div class="flex items-center gap-2 p-4">
			<HandThumbUp size="30" />
			<P>{signatureName} signed!</P>
		</div>
	</Modal>
</div>
