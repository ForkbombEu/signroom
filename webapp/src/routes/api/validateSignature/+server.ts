import { json, type RequestEvent } from '@sveltejs/kit';

export const POST = async (evt: RequestEvent) => {
	const req = await evt.request.json();

	const validateSignature = await fetch(
		`http://dss.forkbomb.eu:8080/services/rest/validation/validateSignature`,
		{
			method: 'POST',
			body: JSON.stringify({
				signedDocument: req.signedDocument,
				policy: null,
				tokenExtractionStrategy: 'NONE',
				signatureId: null
			}),
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		}
	).then(res => {
		if(!res.ok) {
			return res.text().then(text => { throw new Error(text) })
		}
		else {
			return res.json();
		}
	});

	return json(validateSignature);
}