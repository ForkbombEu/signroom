import * as x509 from "@peculiar/x509";

const REAL_CERTIFICATE = 'realCertificate';
const CERTIFICATE_KEY = "certificateKey";
const CERTIFICATE_ZENROOM_KEY = "certificateZenroomKey";
const CERTIFICATE = "certificate";
const ALGORITHM = {
	name: "ECDSA",
	namedCurve: "P-256",
	hash: "SHA-256",
};

function url64ToBase64(input: string): string {
	// Replace non-url compatible chars with base64 standard chars
	input = input.replace(/-/g, '+').replace(/_/g, '/');

	// Pad out with standard base64 required padding characters
	var pad = input.length % 4;
	if(pad) {
	  if(pad === 1) {
		throw new Error('InvalidLengthError: Input base64url string is the wrong length to determine padding');
	  }
	  input += new Array(5-pad).join('=');
	}
	return input;
}

export async function generateKeyAndCertificate(): void {
	// generating keypair
	const keyPair = await crypto.subtle.generateKey(ALGORITHM, true, ["sign", "verify"]);
	// storing the sk in local storage
	const sk = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
	const sk_b64 = btoa(String.fromCharCode(...(new Uint8Array(sk)))).replace(/.{64}/g, '$&\n');
	const completeKey = '-----BEGIN EC PRIVATE KEY-----\n'+sk_b64+'\n-----END EC PRIVATE KEY-----'
	localStorage.setItem(CERTIFICATE_KEY, completeKey);
	// const sk_jwk = await crypto.subtle.exportKey("jwk", keyPair.privateKey);
	// const sk_zenroom = JSON.stringify({es256: url64ToBase64(sk_jwk.d)});
	// localStorage.setItem(CERTIFICATE_ZENROOM_KEY, sk_zenroom);
	// compute date for certificate,
	// valid from yesterday for an year
	var yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);
	var year = new Date();
	year.setFullYear(yesterday.getFullYear() + 1);
	// certificate
	const cert = await x509.X509CertificateGenerator.createSelfSigned({
		serialNumber: "01",
		name: "CN=Test",
		notBefore: yesterday,
		notAfter: year,
		signingAlgorithm: ALGORITHM,
		keys: keyPair,
		extensions: [
			new x509.BasicConstraintsExtension(true, 2, true),
			new x509.ExtendedKeyUsageExtension(["1.2.3.4.5.6.7", "2.3.4.5.6.7.8"], true),
			new x509.KeyUsagesExtension(x509.KeyUsageFlags.keyCertSign | x509.KeyUsageFlags.cRLSign, true),
			await x509.SubjectKeyIdentifierExtension.create(keyPair.publicKey),
		]
	});
	// storing the cert in local storage
	const parsedCert = cert.toString("pem").split('\n').slice(1, -1).join('\n');
	localStorage.setItem(CERTIFICATE, parsedCert);
	localStorage.setItem(REAL_CERTIFICATE, 'false');
}