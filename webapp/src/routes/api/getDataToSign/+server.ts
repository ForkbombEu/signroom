import { json } from '@sveltejs/kit';

export const POST = async (cert: RequestEvent) => {
	const req = await cert.request.json();

	const params = {
		parameters: {
			signingCertificate: {
				encodedCertificate: req.cert_pem
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
				signingDate: req.ts_now,
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
	const toSign = await fetch(`http://dss.forkbomb.eu:8080/services/rest/signature/one-document/getDataToSign`, {
		method: 'POST',
		body: JSON.stringify(params),
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		}
	}).then(res => {
		if(!res.ok) {
			return res.text().then(text => { throw new Error(text) })
		}
		else {
			return res.json();
		}
	});

	return json(toSign);
};
