import type { TemplatesResponse } from '$lib/pocketbase/types';

export type RequestBody = {
	templates: TemplatesResponse[];
};

export function request(body: RequestBody, fetchFn = fetch) {
	return fetchFn('/api/downloadCredentialIssuer', {
		method: 'POST',
		body: JSON.stringify(body),
		headers: {
			'content-type': 'application/json'
		}
	});
}
