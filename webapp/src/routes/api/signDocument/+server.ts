import { json, type RequestEvent } from '@sveltejs/kit';

export const POST = async (evt: RequestEvent) => {
	const req = await evt.request.json();

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
			bytes: req.doc.split(',')[1], // qui da mettere il file vero
			digestAlgorithm: null,
			name: 'RemoteDocument'
		},
		signatureValue: {
			algorithm: 'RSA_SHA256',
			value: req.signedDigest
		}
	};
	const signedDocument = await fetch(`http://dss.forkbomb.eu:8080/services/rest/signature/one-document/signDocument`, {
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

	return json(signedDocument)
}