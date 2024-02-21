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
	import { fromBER } from 'asn1js';
	import { X509Certificate } from '@peculiar/x509';
	import { zencode_exec } from 'zenroom';
	import { pb, currentUser } from '$lib/pocketbase';
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
	import { createTypeProp } from '$lib/utils/typeProp';
	import PortalWrapper from '$lib/components/portalWrapper.svelte';
	import { Plus, ArrowUpTray } from 'svelte-heros-v2';
	import DeleteRecord from '$lib/collectionManager/ui/recordActions/deleteRecord.svelte';
	import { createToggleStore } from '$lib/components/utils/toggleStore';
	import { nanoid } from 'nanoid';

	//

	const converter: Record<string, string> = {
		ECDSA: `Given I have a 'hex' named 'key'
		Then print the 'key' as 'base64'`,
		EdDSA: `Given I have a 'hex' named 'key'
		Then print the 'key' as 'base58'`
	};
	const BEGIN_CERTIFICATE = '-----BEGIN CERTIFICATE-----';
	const END_CERTIFICATE = '-----END CERTIFICATE-----';
	const BEGIN_KEY = '-----BEGIN PRIVATE KEY-----';
	const END_KEY = '-----END PRIVATE KEY-----';
	const BEGIN_EC = '-----BEGIN EC PRIVATE KEY-----';
	const END_EC = '-----END EC PRIVATE KEY-----';

	const allKeys = JSON.parse(localStorage.getItem('certificateKey') || '{}');

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
			const key = await readFile(data.certificate as File);
			await addCertifcateAndKey(data.name, certificate, key);
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

	async function checkCertificate(certificate: string) {
		if (!certificate.startsWith(BEGIN_CERTIFICATE) || !certificate.endsWith(END_CERTIFICATE)) {
			throw 'Invalid ceritifcate: must be in pem format';
		}
		const parsedCertificate = certificate.split('\n').slice(1, -1).join('');
		const certAlg: { name: string; namedCurve?: string } = new X509Certificate(parsedCertificate)
			.publicKey.algorithm;
		const signatureAlgorithmName = certAlg.name;
		if (signatureAlgorithmName == 'ECDSA' && certAlg.namedCurve != 'P-256') {
			throw 'ECDSA signature must be on P-256 curve';
		}
		if (signatureAlgorithmName == 'EdDSA' && certAlg.namedCurve != 'Ed25519') {
			throw 'EdDSA signature must be on Ed25519 curve';
		}
		// signatureAlgorithmName = RSASSA-PKCS1-v1_5
		// signatureAlgorithmName = 1.2.840.113549.1.1.10 (RSA-PSS)
		return { parsedCertificate, signatureAlgorithmName };
	}

	function checkKey(secretKey: string): string {
		var begin = secretKey.indexOf(BEGIN_KEY);
		var end;
		if (begin != -1) {
			begin += BEGIN_KEY.length;
			end = secretKey.indexOf(END_KEY);
		} else {
			begin = secretKey.indexOf(BEGIN_EC);
			if (begin != -1) begin += BEGIN_EC.length;
			end = secretKey.indexOf(END_EC);
		}
		if (end <= begin) throw 'Invalid key: must be in pkcs8 format';
		return secretKey.slice(begin, end).split('\n').join('');
	}

	async function decodeKey(algorithmName: string, secretKey: string): Promise<string | null> {
		const sk = checkKey(secretKey);
		if (algorithmName == 'RSASSA-PKCS1-v1_5' || algorithmName == '1.2.840.113549.1.1.10')
			return null;
		const buf = Uint8Array.from(atob(sk), (c) => c.charCodeAt(0));
		const obj: any = fromBER(buf).valueOf();
		const arr = obj.result.valueBlock.value;
		const hexKey = arr
			.find((value: any[]) => value.constructor.name == '_OctetString')
			.toString()
			.replace(/OCTET STRING :/g, '')
			.trim();
		const { result } = await zencode_exec(converter[algorithmName], {
			data: `{"key": "${hexKey}"}`
		});
		return JSON.parse(result).key;
	}

	async function addCertifcateAndKey(name: string, certificate: string, key: string) {
		if (allKeys[name]) throw 'Certificate name already in use';
		const { parsedCertificate, signatureAlgorithmName } = await checkCertificate(certificate);
		const c: CertificatesRecord = {
			name,
			value: parsedCertificate,
			algorithm: signatureAlgorithmName,
			owner: $currentUser!.id
		};
		try {
			await pb.collection('certificates').create(c);
		} catch (e) {
			throw e;
		}
		const sk = await decodeKey(signatureAlgorithmName, key);
		allKeys[name] = {
			value: key
		};
		if (sk) allKeys[name].zenroomValue = sk;
		localStorage.setItem('certificateKey', JSON.stringify(allKeys));
		location.reload();
	}

	function onCertificateDelete(certificate: CertificatesResponse) {
		console.log(certificate);
	}

	function checkCertificateKeyInLocalStorage(ceritifcate: CertificatesRecord): boolean {
		return Math.random() > 0.5;
	}

	//

	const recordType = createTypeProp<CertificatesResponse>();

	let showModal = false;

	/* Upload key modal */

	let keyUploadModal = createToggleStore(false);

	const keyUploadFormSchema = z.object({
		key: zodFile()
	});

	const keyUploadForm = createForm(
		keyUploadFormSchema,
		async ({ form }) => {
			const key = form.data.key as File;
			const keyContent = await readFile(key);
			console.log(keyContent);
		},
		undefined,
		{
			id: nanoid(5),
			dataType: 'form'
		}
	);
</script>

<div class="p-4 space-y-4 border-slate-200 rounded-lg">
	<CollectionManager collection={Collections.Certificates} {recordType} let:records>
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
				<CollectionEmptyState hideCreateButton />
			</svelte:fragment>

			<svelte:fragment slot="header">
				<TableHeadCell>Key status</TableHeadCell>
			</svelte:fragment>
			<svelte:fragment slot="row" let:record>
				<!-- {@const keyExists = checkCertificateKeyInLocalStorage(record)} -->
				{@const keyExists = false}
				<TableBodyCell>
					{#if keyExists}
						<Badge color="green">Available</Badge>
					{:else}
						<div class="flex items-center gap-2">
							<Badge color="red">Missing</Badge>
							<Button size="xs" color="alternative" on:click={keyUploadModal.on}>
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
</PortalWrapper>
