<script lang="ts">
	import { Button, Heading, Modal } from 'flowbite-svelte';
	import { Form, createForm, FormError, Textarea, SubmitButton } from '$lib/forms';
	import { z } from 'zod';
	import { fromBER } from 'asn1js';
	import { X509Certificate } from "@peculiar/x509";
	import { zencode_exec } from 'zenroom';

	let showModal  = false;
	const converter = {
		ECDSA: `Given I have a 'hex' named 'key'
		Then print the 'key' as 'base64'`,
		EdDSA: `Given I have a 'hex' named 'key'
		Then print the 'key' as 'base58'`
	}
	const BEGIN_CERTIFICATE='-----BEGIN CERTIFICATE-----'
	const END_CERTIFICATE='-----END CERTIFICATE-----'
	const BEGIN_KEY='-----BEGIN PRIVATE KEY-----'
	const END_KEY='-----END PRIVATE KEY-----'
	const BEGIN_EC='-----BEGIN EC PRIVATE KEY-----'
	const END_EC='-----END EC PRIVATE KEY-----'
	const schema = z.object({
		certificate: z.string(),
		key: z.string()
	});

	const superform = createForm(
		schema,
		async ({ form }) => {
			const { data } = form;
			await addCertifcateAndKey(data);
		}
	);

	const key = localStorage.getItem('certificateKey');
	const certificate = localStorage.getItem('certificate') || '';
	const realCertificate = localStorage.getItem('realCertificate');
	const completeCertificate = BEGIN_CERTIFICATE+'\n'+certificate.replace(/.{64}/g, '$&\n')+'\n'+END_CERTIFICATE

	function checkCertificate(certificate: string): [string, string] {
		if(!certificate.startsWith(BEGIN_CERTIFICATE) || !certificate.endsWith(END_CERTIFICATE)) {
			throw("Invalid ceritifcate: must be in pem format");
		}
		const parsedCertificate = certificate.split('\n').slice(1, -1).join('');
		const certAlg: {name: string, namedCurve?: string } = (new X509Certificate(parsedCertificate)).publicKey.algorithm;
		const signatureAlgorithmName = certAlg.name;
		if (signatureAlgorithmName == "ECDSA" && certAlg.namedCurve != "P-256") {
			throw("ECDSA signature must be on P-256 curve");
		}
		if (signatureAlgorithmName == "EdDSA" && certAlg.namedCurve != "Ed25519") {
			throw("EdDSA signature must be on Ed25519 curve");
		}
		// signatureAlgorithmName = RSASSA-PKCS1-v1_5
		// signatureAlgorithmName = 1.2.840.113549.1.1.10 (RSA-PSS)
		return [parsedCertificate, signatureAlgorithmName]
	}

	function checkKey(secretKey: string): string{
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
		if (end <= begin) throw("Invalid key: must be in pkcs8 format");
		return secretKey.slice(begin, end).split('\n').join('');
	}

	async function decodeKey(algorithmName: string, secretKey:string): string {
		const sk = checkKey(secretKey);
		if (algorithmName == 'RSASSA-PKCS1-v1_5' || algorithmName =='1.2.840.113549.1.1.10') return null;
		const buf = Uint8Array.from(atob(sk), c => c.charCodeAt(0));
		const arr = fromBER(buf).result.valueBlock.value;
		const hexKey = arr.find((value) => value.constructor.name == '_OctetString').toString().replace(/OCTET STRING :/g, '').trim();
		const { result } = await zencode_exec(converter[algorithmName], {data: `{"key": "${hexKey}"}`});
		return JSON.parse(result).key;
	}

	async function addCertifcateAndKey(data: {certificate: string, key: string}) {
		const { certificate, key } = data;
		const [parsedCertificate, signatureAlgorithmName] = checkCertificate(certificate)
		const sk = await decodeKey(signatureAlgorithmName, key);
		if(sk) localStorage.setItem('certificateZenroomKey', sk);
		localStorage.setItem('realCertificate', 'true');
		localStorage.setItem('certificate', parsedCertificate);
		localStorage.setItem('certificateAlgorithm', signatureAlgorithmName)
		localStorage.setItem('certificateKey', key);
		location.reload();
	}
</script>


<div class="p-4 space-y-4">
	<Heading tag="h3">Your Certificate</Heading>
	<pre class="bg-white p-4 border border-slate-200 rounded-lg">{completeCertificate}</pre>
	<Heading tag="h3">Your Key</Heading>
	<pre class="bg-white p-4 border border-slate-200 rounded-lg">{key}</pre>
</div>
{#if realCertificate == 'false'}
	<Button on:click={() => (showModal = true)}> Load personal key and certificate </Button>
{:else}
	<Button on:click={() => (showModal = true)}> Change personal key and certificate </Button>
{/if}

<Modal bind:open={showModal} size="md" title="Key and certificate" placement="center">
	<Form {superform}>
		<Textarea {superform} field="certificate" options={{id: "certificate", type:"text", label:"Insert your certificate"}}/>
		<Textarea {superform} field="key" options={{id: "key", type:"text", label:"Insert your key"}}/>
		<FormError />
		<SubmitButton>Submit certificate and key</SubmitButton>
	</Form>
</Modal>