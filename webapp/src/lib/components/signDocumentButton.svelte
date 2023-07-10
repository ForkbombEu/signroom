<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';
	import type { Record } from 'pocketbase';
	import { goto } from '$app/navigation';
	//@ts-ignore
	import forge from 'node-forge';

	const pki = forge.pki;

	export let record: Record;

	let url = '';
	if (record) url = pb.files.getUrl(record, record.file);

	async function sign(algo: string) {
		//get the file to sign
		const res = await fetch(url);
		const blob = await res.blob();
		console.log('blob', blob);
		const reader = new FileReader();
		reader.readAsDataURL(blob);
		let fb64 = null;
		reader.onerror = (error) => {
			console.error('Error: ', error);
		};
		reader.onloadend = async () => {
			//@ts-ignore
			fb64 = reader.result.split(',')[1];
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
			await pb.collection('signatures').update(record.id, formData);

			//6. redirect to signed document
			goto(`/my/signatures/${algo}?id=${record.id}`);
		};
	}
</script>

<Button color="primary" size="sm" id="sign-button">Sign</Button>
<Dropdown class="w-text-sm font-light" triggeredBy="#sign-button">
	{#each ['xades', 'pades', 'sades'] as algo}
		<DropdownItem>
			<Button
				outline
				size="sm"
				class="!px-4 !py-2 whitespace-nowrap gap-2 w-fit"
				on:click={() => sign(algo)}
			>
				Sign as {algo}
			</Button>
		</DropdownItem>
	{/each}
</Dropdown>
