import * as x509 from "@peculiar/x509";

const CERTIFICATE_KEY = "certificateKey";
const CERTIFICATE = "certificate";
const ALGORITHM = {
	name: "ECDSA",
	namedCurve: "P-256",
	hash: "SHA-256",
};

export async function generateKeyAndCertificate(): void {
	// generating keypair
	const keyPair = await crypto.subtle.generateKey(ALGORITHM, true, ["sign", "verify"]);
	// storing the sk in local storage
	const sk = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
	const sk_b64 = btoa(String.fromCharCode(...(new Uint8Array(sk))));
	localStorage.setItem(CERTIFICATE_KEY, sk_b64);
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
}