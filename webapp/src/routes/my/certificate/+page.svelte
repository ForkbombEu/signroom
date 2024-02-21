<script lang="ts">
	import { Button, Heading, Modal } from 'flowbite-svelte';
	import { Form, createForm, FormError, Input, SubmitButton, File, zodFile } from '$lib/forms';
	import { z } from 'zod';
	import { fromBER } from 'asn1js';
	import { X509Certificate } from '@peculiar/x509';
	import { zencode_exec } from 'zenroom';
	import { pb, currentUser } from '$lib/pocketbase';
	import {
		CollectionManager,
		CollectionManagerHeader,
		CollectionTable
	} from '$lib/collectionManager';
	import {
		Collections,
		type CertificatesResponse,
		type CertificatesRecord
	} from '$lib/pocketbase/types';
	import { createTypeProp } from '$lib/utils/typeProp';

	const recordType = createTypeProp<CertificatesResponse>();

	let showModal: boolean = false;
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

	const schema = z.object({
		name: z.string(),
		certificate: zodFile(),
		key: zodFile()
	});

	const superform = createForm(schema, async ({ form }) => {
		const { data } = form;
		await addCertifcateAndKey(data);
	});

	const allKeys = JSON.parse(localStorage.getItem('certificateKey') || '{}');

	async function getFile(f) {
		var file = f.files[0];
		let res: string;
		try {
			res = await new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.readAsText(file);
				reader.onload = () => {
					resolve(reader.result as string);
				};
			});
		} catch (e) {
			throw e;
		}
		return res.trim();
	}

	async function checkCertificate(): Promise<[string, string]> {
		const certificate = await getFile(document.getElementById('certificate'));
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
		return [parsedCertificate, signatureAlgorithmName];
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

	async function addCertifcateAndKey(data: { name: string; certificate: string; key: string }) {
		const name = data.name;
		if (allKeys[name]) throw 'Certificate name already in use';
		const [parsedCertificate, signatureAlgorithmName] = await checkCertificate(certificate);
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
		const k = await getFile(document.getElementById('key'));
		const sk = await decodeKey(signatureAlgorithmName, k);
		allKeys[name] = {
			value: k
		};
		if (sk) allKeys[name].zenroomValue = sk;
		localStorage.setItem('certificateKey', JSON.stringify(allKeys));
		location.reload();
	}
</script>

<div class="p-4 space-y-4 border-slate-200 rounded-lg">
	<CollectionManager collection={Collections.Certificates} {recordType} let:records>
		<CollectionManagerHeader>
			<svelte:fragment slot="title">
				<Heading tag="h4">My Certificates</Heading>
			</svelte:fragment>
		</CollectionManagerHeader>
		<CollectionTable
			{records}
			fields={['name', 'algorithm']}
			hideActions={['select', 'edit', 'share']}
			let:record
		></CollectionTable>
	</CollectionManager>
	<Button on:click={() => (showModal = true)}>Add another Key and Certificate Pair</Button>
	<Modal bind:open={showModal} size="md" title="Key and certificate" placement="center">
		<Form {superform}>
			<Input
				{superform}
				field="name"
				options={{ id: 'name', type: 'text', label: 'Insert your certificate name' }}
			/>
			<File
				{superform}
				field="certificate"
				options={{ id: 'certificate', label: 'Select your certificate' }}
			/>
			<File
				{superform}
				field="key"
				options={{ id: 'key', type: 'text', label: 'Select your key' }}
			/>
			<FormError />
			<SubmitButton>Submit certificate and key</SubmitButton>
		</Form>
	</Modal>
</div>
