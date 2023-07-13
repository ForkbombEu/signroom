<script lang="ts">
	import CreateRecord from '$lib/schema/recordsManager/recordActions/createRecord.svelte';
	import { ArrowKeyDown, Button, Dropdown, DropdownItem, Modal, Spinner, P } from 'flowbite-svelte';

	import TitleDescription from './titleDescription.svelte';
	import { ClipboardDocumentCheck } from 'svelte-heros-v2';
	import { getRecordsManagerContext } from '$lib/schema/recordsManager/recordsManager.svelte';
	//@ts-ignore
	import forge from 'node-forge';
	import { pb } from '$lib/pocketbase';
	import RenderSignedFile from '../../routes/my/signatures/_partials/RenderSignedFile.svelte';

	import type { SignaturesTypeOptions } from '$lib/pocketbase-types';
	import type { SignedFile } from '../../routes/my/signatures/_partials/SignedFileDisplay.svelte';
	import SignaturesFoldersHead from './signaturesFoldersHead.svelte';

	export let folderId: string | null = null;

	const { formSettings, dataManager } = getRecordsManagerContext();
	const { loadRecords } = dataManager;

	const createRecord = (type: String, cb: () => void) => {
		formSettings.hiddenFieldsValues!.type = type;
		cb();
	};
	const pki = forge.pki;

	let loading = false;
	let error = null;
	let signedFile: SignedFile | null = null;
	let type: SignaturesTypeOptions | null = null;

	async function sign(record: any) {
		loading = true;
		error = null;

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

		// current timestamp
		const ts_now = Date.now();
		// yesterday timestamp to be used as notBefore
		// date in the x509 certificate
		var yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);

		//1. generate a rsa keypair and a X.509v3 certificate
		const keypair = pki.rsa.generateKeyPair(2048);
		var cert = pki.createCertificate();
		cert.publicKey = keypair.publicKey;
		cert.serialNumber = '01';
		cert.validity.notBefore = yesterday;
		cert.validity.notAfter = new Date();
		cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
		const attrs = [
			{
				name: 'commonName',
				value: ''
			},
			{
				name: 'countryName',
				value: ''
			},
			{
				shortName: 'ST',
				value: ''
			},
			{
				name: 'localityName',
				value: ''
			},
			{
				name: 'organizationName',
				value: ''
			},
			{
				shortName: 'OU',
				value: ''
			}
		];
		cert.setSubject(attrs);
		cert.setIssuer(attrs);
		// self-sign certificate
		cert.sign(keypair.privateKey);
		// convert a Forge certificate to PEM
		var cert_pem = pki.certificateToPem(cert);
		cert_pem = cert_pem.split('\r\n').slice(1, -2).join('\n');

		//2. get data to sign
		const toSign = await fetch('/api/getDataToSign', {
			method: 'POST',
			body: JSON.stringify({ algo, doc: fb64, cert_pem, ts_now }),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
		const toBeSigned = await toSign.json();

		//3. sign digest of data
		var md = forge.md.sha256.create();
		md.update(atob(toBeSigned.bytes), 'raw');
		const signedDigest = btoa(keypair.privateKey.sign(md));

		//4. sign document (insert signature)
		const signed = await fetch('/api/signDocument', {
			method: 'POST',
			body: JSON.stringify({ cert_pem, ts_now, signedDigest, doc: fb64, algo }),
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
		signedFile = rc.signed_file;
		type = rc.type;
	}
</script>

<div class="flex flex-col md:flex-row justify-between gap-4 md:items-end items-start mb-8">
	{#if !folderId}
		<TitleDescription title="My signatures" description="Here you can see all your signatures" />
	{:else}
		<SignaturesFoldersHead {folderId} />
	{/if}
	<div class="md:ml-4">
		<CreateRecord let:openModal on:success={(e) => sign(e.detail.record)}>
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
		</CreateRecord>
	</div>
</div>

<div class="fixed m-0 p-0 z-50">
	<Modal open={loading} permanent>
		<div class="flex flex-col items-center gap-2">
			<Spinner />
			<P>Signing document, please wait</P>
		</div>
	</Modal>

	{#if type && signedFile}
		<Modal open={Boolean(signedFile)} title="Signed" size="lg">
			<div class="md:w-[600px]">
				<RenderSignedFile {signedFile} {type} />
			</div>
		</Modal>
	{/if}
</div>
