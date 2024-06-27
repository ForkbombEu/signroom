import { json, type RequestEvent } from '@sveltejs/kit';
import policyConstraint from './policy.xml?raw';

export const POST = async (evt: RequestEvent) => {
	const req = await evt.request.json();
	const { fetch } = evt;

	const policy = {
		bytes: btoa(policyConstraint),
		digestAlgorithm: null,
		name: 'policy.xml'
	};

	const validateSignature = await fetch(
		`http://dss.forkbomb.eu:8080/services/rest/validation/validateSignature`,
		{
			method: 'POST',
			body: JSON.stringify({
				signedDocument: req.signedDocument,
				policy
			}),
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

	return json(validateSignature);
};
