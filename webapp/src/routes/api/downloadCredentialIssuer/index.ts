import { z } from 'zod';

export const formSchema = z.object({
	credential_issuer_url: z.string().url(),
	authorization_server: z.string().url()
});

export const requestSchema = formSchema.extend({
	credential_name: z.string(), // Generate from service name
	credential_issuer_name: z.string(), // Generate from organization name
	templates: z.array(z.string()) // List of JSON schemas
});

export type RequestBody = z.infer<typeof requestSchema>;

export function request(body: RequestBody, fetchFn = fetch) {
	return fetchFn('/api/downloadCredentialIssuer', {
		method: 'POST',
		body: JSON.stringify(body),
		headers: {
			'content-type': 'application/json'
		}
	});
}
