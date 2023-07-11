<script lang="ts">
	import forge from 'node-forge';

	const pki = forge.pki;
	let result: any;

	async function sign(algo: String, doc: String) {
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
			body: JSON.stringify({ algo, doc, cert_pem, ts_now }),
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
			body: JSON.stringify({ algo, doc, cert_pem, ts_now, signedDigest }),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
		const signedDocument = await signed.json();

		//5. validate siganture
		const validate = await fetch('/api/validateSignature', {
			method: 'POST',
			body: JSON.stringify({ signedDocument }),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		});
		const validateResult = await validate.json();

		result = { signedDocument, validateResult };
	}

	// second input should be the base64 encoding of the stuff to sign
	function sign_xades() {
		sign('xades', '');
	}
	function sign_jades() {
		sign('jades', '');
	}
	function sign_pades() {
		sign('pades', '');
	}
	function sign_cades() {
		sign('cades', '');
	}
</script>

<button on:click={sign_xades}>sign with xades</button>
<button on:click={sign_jades}>sign with jades</button>
<button on:click={sign_pades}>sign with pades</button>
<button on:click={sign_cades}>sign with cades</button>

<pre>
    {JSON.stringify(result, null, 2)}
</pre>
