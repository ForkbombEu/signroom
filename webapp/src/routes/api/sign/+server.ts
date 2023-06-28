import { digest, newkey } from '$lib/xades';
import { json } from '@sveltejs/kit';

export const GET = async () => {
	const sk = await newkey();
	const baseurl = 'http://dss.forkbomb.eu:8080/services/rest/signature/one-document';
	const ts = Date.now();

	const params = {
		parameters: {
			signingCertificate: {
				encodedCertificate: sk.cert
			},
			certificateChain: [],
			detachedContents: null,
			asicContainerType: null,
			signatureLevel: 'XAdES_BASELINE_B',
			signaturePackaging: 'ENVELOPING',
			embedXML: false,
			manifestSignature: false,
			jwsSerializationType: null,
			sigDMechanism: null,
			signatureAlgorithm: 'RSA_SHA256',
			digestAlgorithm: 'SHA256',
			encryptionAlgorithm: 'RSA',
			referenceDigestAlgorithm: null,
			maskGenerationFunction: null,
			contentTimestamps: null,
			contentTimestampParameters: {
				digestAlgorithm: 'SHA256',
				canonicalizationMethod: 'http://www.w3.org/2001/10/xml-exc-c14n#',
				timestampContainerForm: null
			},
			signatureTimestampParameters: {
				digestAlgorithm: 'SHA256',
				canonicalizationMethod: 'http://www.w3.org/2001/10/xml-exc-c14n#',
				timestampContainerForm: null
			},
			archiveTimestampParameters: {
				digestAlgorithm: 'SHA256',
				canonicalizationMethod: 'http://www.w3.org/2001/10/xml-exc-c14n#',
				timestampContainerForm: null
			},
			signWithExpiredCertificate: false,
			generateTBSWithoutCertificate: false,
			imageParameters: null,
			signatureIdToCounterSign: null,
			blevelParams: {
				trustAnchorBPPolicy: true,
				signingDate: ts,
				claimedSignerRoles: null,
				policyId: null,
				policyQualifier: null,
				policyDescription: null,
				policyDigestAlgorithm: null,
				policyDigestValue: null,
				policySpuri: null,
				commitmentTypeIndications: null,
				signerLocationPostalAddress: [],
				signerLocationPostalCode: null,
				signerLocationLocality: null,
				signerLocationStateOrProvince: null,
				signerLocationCountry: null,
				signerLocationStreet: null
			}
		},
		toSignDocument: {
			bytes: 'SGVsbG8=', // qui da mettere il file vero
			digestAlgorithm: null,
			name: 'RemoteDocument'
		}
	};
	const toSign = await fetch(`${baseurl}/getDataToSign`, {
		method: 'POST',
		body: JSON.stringify(params),
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		}
	});

	const dataToSign = await toSign.json();
	const messageDigest = await digest(dataToSign.bytes);
	params['signatureValue'] = {
		algorithm: 'RSA_SHA256',
		value: messageDigest
	};
	const signed = await fetch(`${baseurl}/signDocument`, {
		method: 'POST',
		body: JSON.stringify(params),
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		}
	});
	const signedDocument = await signed.json();
	const validateSignature = await fetch(
		`http://dss.forkbomb.eu:8080/services/rest/validation/validateSignature`,
		{
			method: 'POST',
			body: JSON.stringify({
				signedDocument: signedDocument,
				policy: null,
				tokenExtractionStrategy: 'NONE',
				signatureId: null
			}),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		}
	);
	const validation = await validateSignature.json();

	return json({ signedDocument, validation });
};
