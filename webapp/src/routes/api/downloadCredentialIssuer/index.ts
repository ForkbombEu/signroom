import { objectSchemaValidator } from '$lib/jsonSchema/types';
import { z } from 'zod';

//

export const requestBodySchema = z.object({
	credential_issuer_url: z.string().url(),
	authorization_server: z.string().url(),
	credential_name: z.string(), // Generate from service name
	credential_issuer_name: z.string(), // Generate from organization name
	templates: z.array(objectSchemaValidator) // List of JSON schemas
});

//

export type RequestBody = z.infer<typeof requestBodySchema>;

export function request(body: RequestBody, fetchFn = fetch) {
	return fetchFn('/api/downloadCredentialIssuer', {
		method: 'POST',
		body: JSON.stringify(body),
		headers: {
			'content-type': 'application/json'
		}
	});
}
