import * as x509 from '@peculiar/x509';
import { pb } from '$lib/pocketbase';
import type { CertificatesRecord } from '$lib/pocketbase/types';

const CERTIFICATE_KEY = 'certificateKey';
const ALGORITHM = {
	name: 'ECDSA',
	namedCurve: 'P-256',
	hash: 'SHA-256'
};

function url64ToBase64(input: string): string {
	// Replace non-url compatible chars with base64 standard chars
	input = input.replace(/-/g, '+').replace(/_/g, '/');

	// Pad out with standard base64 required padding characters
	var pad = input.length % 4;
	if (pad) {
		if (pad === 1) {
			throw new Error(
				'InvalidLengthError: Input base64url string is the wrong length to determine padding'
			);
		}
		input += new Array(5 - pad).join('=');
	}
	return input;
}

export async function generateKeyAndCertificate(
	name: string,
	userId: string,
	allKeys: Record<string, any>
) {
	// generating keypair
	const keyPair = await crypto.subtle.generateKey(ALGORITHM, true, ['sign', 'verify']);
	// storing the sk in local storage
	const sk = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
	const sk_b64 = btoa(String.fromCharCode(...new Uint8Array(sk))).replace(/.{64}/g, '$&\n');
	const completeKey =
		'-----BEGIN EC PRIVATE KEY-----\n' + sk_b64 + '\n-----END EC PRIVATE KEY-----';
	// raw key to be used in zenroom
	const sk_jwk = await crypto.subtle.exportKey('jwk', keyPair.privateKey);
	if (!sk_jwk.d) throw new Error('Undefined sk_jwk.d');
	allKeys[name] = {
		value: completeKey,
		zenroomValue: url64ToBase64(sk_jwk.d)
	};
	localStorage.setItem(CERTIFICATE_KEY, JSON.stringify(allKeys));
	// compute date for certificate,
	// valid from yesterday for an year
	var yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);
	var year = new Date();
	year.setFullYear(yesterday.getFullYear() + 1);
	// certificate
	const cert = await x509.X509CertificateGenerator.createSelfSigned({
		serialNumber: '01',
		name: 'CN=Test',
		notBefore: yesterday,
		notAfter: year,
		signingAlgorithm: ALGORITHM,
		keys: keyPair,
		extensions: [
			new x509.BasicConstraintsExtension(true, 2, true),
			new x509.ExtendedKeyUsageExtension(['1.2.3.4.5.6.7', '2.3.4.5.6.7.8'], true),
			new x509.KeyUsagesExtension(
				x509.KeyUsageFlags.keyCertSign | x509.KeyUsageFlags.cRLSign,
				true
			),
			await x509.SubjectKeyIdentifierExtension.create(keyPair.publicKey)
		]
	});
	const parsedCert = cert.toString('pem').split('\n').slice(1, -1).join('');
	const c: CertificatesRecord = {
		name,
		value: parsedCert,
		algorithm: 'ECDSA',
		owner: userId
	};
	try {
		await pb.collection('certificates').create(c);
	} catch (e) {
		throw e;
	}
}
