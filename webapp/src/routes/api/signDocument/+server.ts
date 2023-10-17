import { json, type RequestEvent } from '@sveltejs/kit';

export const POST = async (evt: RequestEvent) => {
	const req = await evt.request.json();

	const params:Record<string, any> = {
		parameters: {
			signingCertificate: {
				encodedCertificate: req.cert_pem
			},
			certificateChain: [],
			detachedContents: null,
			asicContainerType: null,
			signatureAlgorithm: 'ECDSA_SHA256',
			digestAlgorithm: 'SHA256',
			encryptionAlgorithm: 'ECDSA',
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
			bytes: req.doc,
			digestAlgorithm: null,
			name: 'RemoteDocument'
		},
		signatureValue: {
			algorithm: 'ECDSA_SHA256',
			value: req.signedDigest
		}
	};

	switch (req.algo) {
		case 'xades':
			params.parameters.signaturePackaging = 'ENVELOPING';
			params.parameters.signatureLevel = 'XAdES_BASELINE_B';
			break;
		case 'pades':
			params.parameters.signatureLevel = 'PAdES_BASELINE_B';
			break;
		case 'jades':
			params.parameters.signaturePackaging = 'ENVELOPING';
			params.parameters.signatureLevel = 'JAdES_BASELINE_B';
			break;
		case 'cades':
			params.parameters.signatureLevel = 'CAdES_BASELINE_B';
			params.parameters.signaturePackaging = 'ENVELOPING';
			break;
	}

	const signedDocument = await fetch(
		`http://dss.forkbomb.eu:8080/services/rest/signature/one-document/signDocument`,
		{
			method: 'POST',
			body: JSON.stringify(params),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		}
	).then((res) => {
		if (!res.ok) {
			return res.text().then((text) => {
				throw new Error(text);
			});
		} else {
			return res.json();
		}
	});

	return json(signedDocument);
};
