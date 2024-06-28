import { json, type RequestEvent, error } from '@sveltejs/kit';
import policyConstraint from './policy.xml?raw';

export const POST = async (evt: RequestEvent) => {
	const req = await evt.request.json();
	const { fetch } = evt;

	const policy = {
		bytes: btoa(policyConstraint),
		digestAlgorithm: null,
		name: 'policy.xml'
	};

	const res = await fetch(
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
	);

	if (!res.ok) {
		const text = await res.text();
		return error(422, text);
	} else {
		return json(await res.json());
	}
};
